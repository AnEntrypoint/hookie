# Content Manager

## Purpose
Handles loading and saving of page JSON and component schemas to/from GitHub repository. Manages the /content/pages and /content/components directories in the repository.

## Dependencies
Requires github.md module for GitHub API operations.

## Exports

### `loadPage(owner, repo, pageName)`
Loads a page JSON file from the repository.

**Parameters:**
- `owner` (string, required): GitHub repository owner
- `repo` (string, required): Repository name
- `pageName` (string, required): Page name (without .json extension)

**Returns:** Promise that resolves to page data object with structure `{ name, title, components: [] }`

**Behavior:**
- Constructs file path exactly as: `/content/pages/${pageName}.json`
- Uses github.readFile(owner, repo, path) to fetch content
- Parses JSON content using JSON.parse()
- Returns parsed object
- Throws PageNotFoundError if file returns 404
- Throws JSONParseError with original content if JSON.parse() fails
- Throws NetworkError for network failures
- Throws AuthError for authentication failures

### `savePage(owner, repo, pageName, pageData, commitMessage)`
Saves or creates a page JSON file.

**Parameters:**
- `owner` (string, required): Repository owner
- `repo` (string, required): Repository name
- `pageName` (string, required): Page name (without .json extension)
- `pageData` (object, required): Page data structure to save
- `commitMessage` (string, required): Git commit message (defaults to `"Update page: ${pageName}"` if empty string provided)

**Returns:** Promise that resolves to commit result object `{ commit, content }`

**Behavior:**
- MUST validate pageData is an object with required fields: name, title, components (array)
- Throws ValidationError if pageData validation fails
- Constructs file path exactly as: `/content/pages/${pageName}.json`
- Stringifies pageData using JSON.stringify(pageData, null, 2) (exactly 2-space indentation)
- Uses github.writeFile(owner, repo, path, content, commitMessage) to save
- Returns commit result
- Uses default commit message `"Update page: ${pageName}"` if commitMessage is empty string
- Throws NetworkError for network failures
- Throws AuthError for authentication failures

### `deletePage(owner, repo, pageName, commitMessage)`
Deletes a page file from the repository.

**Parameters:**
- `owner` (string, required): Repository owner
- `repo` (string, required): Repository name
- `pageName` (string, required): Page name (without .json extension)
- `commitMessage` (string, required): Git commit message (defaults to `"Delete page: ${pageName}"` if empty string provided)

**Returns:** Promise that resolves to commit result object `{ commit }`

**Behavior:**
- Constructs file path exactly as: `/content/pages/${pageName}.json`
- First reads file to get SHA using github.readFile()
- Uses github.deleteFile(owner, repo, path, commitMessage, sha) to delete
- Returns commit result
- Uses default commit message `"Delete page: ${pageName}"` if commitMessage is empty string
- Throws PageNotFoundError if file does not exist
- Throws NetworkError for network failures
- Throws AuthError for authentication failures

### `listPages(owner, repo)`
Lists all page files in the /content/pages directory.

**Parameters:**
- `owner` (string, required): Repository owner
- `repo` (string, required): Repository name

**Returns:** Promise that resolves to array of page names (strings, without .json extension), sorted alphabetically

**Behavior:**
- Uses github.getRepoStructure(owner, repo) to get directory contents
- Filters results to include only files from '/content/pages/' directory
- Filters to include only files ending with '.json'
- Extracts file names by removing '.json' extension
- Sorts array alphabetically using Array.sort()
- Returns empty array [] if directory doesn't exist or contains no JSON files
- Throws NetworkError for network failures
- Throws AuthError for authentication failures

### `loadComponentSchema(owner, repo, componentName)`
Loads a custom component schema from the repository.

**Parameters:**
- `owner` (string, required): Repository owner
- `repo` (string, required): Repository name
- `componentName` (string, required): Component name (without .json extension)

**Returns:** Promise that resolves to schema object with structure `{ name, description, props, allowedChildren, defaultStyle }`

**Behavior:**
- Constructs file path exactly as: `/content/components/${componentName}.json`
- Uses github.readFile(owner, repo, path) to fetch content
- Parses JSON content using JSON.parse()
- MUST validate schema has required fields: name (string), description (string), props (object), allowedChildren (array), defaultStyle (object)
- Throws SchemaValidationError if required fields are missing or wrong type
- Returns parsed schema object
- Throws ComponentNotFoundError if file returns 404
- Throws JSONParseError if JSON.parse() fails
- Throws NetworkError for network failures
- Throws AuthError for authentication failures

### `saveComponentSchema(owner, repo, componentName, schema, commitMessage)`
Saves a custom component schema to the repository.

**Parameters:**
- `owner` (string, required): Repository owner
- `repo` (string, required): Repository name
- `componentName` (string, required): Component name (without .json extension)
- `schema` (object, required): Component schema object
- `commitMessage` (string, required): Git commit message (defaults to `"Save component schema: ${componentName}"` if empty string provided)

**Returns:** Promise that resolves to commit result object `{ commit, content }`

**Behavior:**
- MUST validate schema has required fields: name (string), description (string), props (object), allowedChildren (array), defaultStyle (object)
- Throws SchemaValidationError if validation fails
- Constructs file path exactly as: `/content/components/${componentName}.json`
- Stringifies schema using JSON.stringify(schema, null, 2) (exactly 2-space indentation)
- Uses github.writeFile(owner, repo, path, content, commitMessage) to save
- Returns commit result
- Uses default commit message `"Save component schema: ${componentName}"` if commitMessage is empty string
- Throws NetworkError for network failures
- Throws AuthError for authentication failures

### `listComponentSchemas(owner, repo)`
Lists all custom component schema files.

**Parameters:**
- `owner` (string, required): Repository owner
- `repo` (string, required): Repository name

**Returns:** Promise that resolves to array of component names (strings, without .json extension), sorted alphabetically

**Behavior:**
- Uses github.getRepoStructure(owner, repo) to get directory contents
- Filters results to include only files from '/content/components/' directory
- Filters to include only files ending with '.json'
- Extracts file names by removing '.json' extension
- Sorts array alphabetically using Array.sort()
- Returns empty array [] if directory doesn't exist or contains no JSON files
- Throws NetworkError for network failures
- Throws AuthError for authentication failures

## Page Data Structure
Pages MUST follow this exact structure:
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

Required fields:
- name (string)
- title (string)
- components (array)

Each component MUST have:
- id (string)
- type (string)
- props (object)
- style (object)
- children (array)

## Component Schema Structure
Component schemas MUST follow this exact structure:
```
{
  "name": "ComponentName",
  "description": "Component description",
  "props": {
    "propName": {
      "type": "string",
      "required": false,
      "default": "value",
      "options": []
    }
  },
  "allowedChildren": ["*"],
  "defaultStyle": {}
}
```

Required fields:
- name (string)
- description (string)
- props (object)
- allowedChildren (array)
- defaultStyle (object)

## Error Handling
All functions MUST implement these exact error behaviors:
- Throw PageNotFoundError with message "Page '${pageName}' not found" for 404 on page files
- Throw ComponentNotFoundError with message "Component '${componentName}' not found" for 404 on component files
- Throw JSONParseError with message "Failed to parse JSON: ${error.message}" for JSON parsing failures
- Throw ValidationError with message describing which field failed validation
- Throw SchemaValidationError with message describing which schema field is missing or invalid
- Throw NetworkError with message "Network request failed: ${error.message}" for network failures
- Throw AuthError with message "Authentication failed: ${error.message}" for auth failures (401, 403)
- Log all errors to console using console.error() before throwing

## Implementation Notes
- All file paths MUST use forward slashes
- JSON MUST be stringified with exactly 2-space indentation using JSON.stringify(data, null, 2)
- All async operations MUST use proper try/catch error handling
- Empty arrays MUST be returned (not null) when directories are empty or don't exist
- Default commit messages MUST follow the exact format specified for each function
- File paths MUST NOT have leading slash when passed to github functions
- Validation MUST occur before any GitHub API calls to fail fast
