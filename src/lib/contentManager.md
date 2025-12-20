# Content Manager

## Purpose
Handles loading and saving of page JSON and component schemas to/from GitHub repository. Manages the /content/pages and /content/components directories in the repository.

## Dependencies
Requires github.md module for GitHub API operations.

## Exports

### `loadPage(owner, repo, pageName)`
Loads a page JSON file from the repository.

**Parameters:**
- `owner` (string): GitHub repository owner
- `repo` (string): Repository name
- `pageName` (string): Page name (without .json extension)

**Returns:** Promise that resolves to page data object, or null if not found

**Behavior:**
- Construct file path: `/content/pages/${pageName}.json`
- Use github.readFile(owner, repo, path) to fetch content
- Parse JSON content
- Return parsed object
- If file not found (404), return null instead of throwing
- If JSON parse fails, throw error with message
- Handle other errors gracefully with descriptive messages

### `savePage(owner, repo, pageName, pageData, commitMessage)`
Saves or creates a page JSON file.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `pageName` (string): Page name (without .json extension)
- `pageData` (object): Page data structure to save
- `commitMessage` (string): Git commit message

**Returns:** Promise that resolves to commit result object

**Behavior:**
- Construct file path: `/content/pages/${pageName}.json`
- Stringify pageData with 2-space indentation
- Use github.writeFile(owner, repo, path, content, commitMessage) to save
- Return commit result
- Validate pageData is an object before saving
- Ensure commitMessage is provided, use default if not: `"Update page: ${pageName}"`

### `deletePage(owner, repo, pageName, commitMessage)`
Deletes a page file from the repository.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `pageName` (string): Page name (without .json extension)
- `commitMessage` (string): Git commit message

**Returns:** Promise that resolves to commit result object

**Behavior:**
- Construct file path: `/content/pages/${pageName}.json`
- Use github.deleteFile(owner, repo, path, commitMessage) to delete
- Return commit result
- Handle file not found gracefully
- Default commit message if not provided: `"Delete page: ${pageName}"`

### `listPages(owner, repo)`
Lists all page files in the /content/pages directory.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name

**Returns:** Promise that resolves to array of page names (without .json extension)

**Behavior:**
- Use github.getDirectoryContents(owner, repo, '/content/pages') to list files
- Filter results to only .json files
- Extract file names without .json extension
- Return array of page names sorted alphabetically
- If directory doesn't exist, return empty array
- Handle errors gracefully

### `loadComponentSchema(owner, repo, componentName)`
Loads a custom component schema from the repository.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `componentName` (string): Component name (without .json extension)

**Returns:** Promise that resolves to schema object, or null if not found

**Behavior:**
- Construct file path: `/content/components/${componentName}.json`
- Use github.readFile(owner, repo, path) to fetch content
- Parse JSON content
- Return parsed schema object
- If file not found, return null
- Validate schema structure has required fields (name, props)

### `saveComponentSchema(owner, repo, componentName, schema, commitMessage)`
Saves a custom component schema to the repository.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `componentName` (string): Component name (without .json extension)
- `schema` (object): Component schema object
- `commitMessage` (string): Git commit message

**Returns:** Promise that resolves to commit result object

**Behavior:**
- Validate schema has required fields (name, props, allowedChildren)
- Construct file path: `/content/components/${componentName}.json`
- Stringify schema with 2-space indentation
- Use github.writeFile(owner, repo, path, content, commitMessage) to save
- Return commit result
- Default commit message if not provided: `"Save component schema: ${componentName}"`

### `listComponentSchemas(owner, repo)`
Lists all custom component schema files.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name

**Returns:** Promise that resolves to array of component names (without .json extension)

**Behavior:**
- Use github.getDirectoryContents(owner, repo, '/content/components') to list files
- Filter results to only .json files
- Extract file names without .json extension
- Return array of component names sorted alphabetically
- If directory doesn't exist, return empty array
- Handle errors gracefully

## Page Data Structure
Pages should follow this structure:
```
{
  "name": "page-name",
  "title": "Page Title",
  "components": [
    {
      "id": "unique-id",
      "type": "ComponentName",
      "props": {},
      "style": {},
      "children": []
    }
  ]
}
```

## Component Schema Structure
Component schemas should follow this structure:
```
{
  "name": "ComponentName",
  "description": "Component description",
  "props": {
    "propName": {
      "type": "string",
      "required": false,
      "default": "value"
    }
  },
  "allowedChildren": ["*"],
  "defaultStyle": {}
}
```

## Error Handling
- Return null for file-not-found scenarios (don't throw)
- Throw descriptive errors for JSON parse failures
- Throw descriptive errors for API failures
- Validate data structures before saving
- Log errors to console for debugging

## Implementation Notes
- All file paths should use forward slashes
- JSON should be stringified with 2-space indentation for readability
- Cache results where appropriate for performance
- Ensure all async operations use proper error handling
