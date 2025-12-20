# PageManager Component

## Purpose
Manages page list, creation, deletion, and selection. Provides UI for navigating between pages in the CMS.

## Component Type
React functional component

## Dependencies
- contentManager.md for page operations

## Props
- `owner` (string): GitHub repository owner
- `repo` (string): Repository name
- `onSelectPage` (function): Callback when page is selected
  - Signature: `(page: { name, data }) => void`

## State Management
Use React useState for:
- `pages` (array): List of page names
- `loading` (boolean): Loading state
- `creating` (boolean): Creating new page state
- `newPageName` (string): Name input for new page
- `error` (string|null): Error message

## Lifecycle
On component mount (useEffect):
1. Load list of pages using contentManager.listPages(owner, repo)
2. Set pages state
3. Handle loading and error states

## Rendering Logic

### Loading State
Display: "Loading pages..." or spinner

### Error State
Display error message with retry button

### Page List
Display grid or list of page cards:
- Page name
- Preview thumbnail (if available)
- Last modified date (from git)
- Click to select page
- Delete button
- Duplicate button

### New Page Form
- Text input for page name
- "Create Page" button
- Cancel button if in creation mode

## Page Operations

### List Pages
```
async () => {
  setLoading(true);
  try {
    const pageList = await contentManager.listPages(owner, repo);
    setPages(pageList);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

### Create New Page
```
async (pageName) => {
  if (!pageName.trim()) {
    setError('Page name is required');
    return;
  }

  // Validate page name (alphanumeric, hyphens, underscores)
  if (!/^[a-z0-9-_]+$/.test(pageName)) {
    setError('Page name can only contain lowercase letters, numbers, hyphens, and underscores');
    return;
  }

  setCreating(true);
  try {
    const defaultPageData = {
      name: pageName,
      title: pageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      components: [
        {
          id: 'root-' + Date.now(),
          type: 'Container',
          props: { maxWidth: '1200px' },
          style: {},
          children: [
            {
              id: 'heading-' + Date.now(),
              type: 'Heading',
              props: { level: 1, text: 'Welcome to ' + pageName },
              style: {},
              children: []
            }
          ]
        }
      ]
    };

    await contentManager.savePage(owner, repo, pageName, defaultPageData, `Create page: ${pageName}`);

    // Reload page list
    const pageList = await contentManager.listPages(owner, repo);
    setPages(pageList);

    // Clear form
    setNewPageName('');
    setCreating(false);

    // Select the new page
    onSelectPage({ name: pageName, data: defaultPageData });
  } catch (err) {
    setError(err.message);
    setCreating(false);
  }
}
```

### Select Page
```
async (pageName) => {
  setLoading(true);
  try {
    const pageData = await contentManager.loadPage(owner, repo, pageName);
    if (pageData) {
      onSelectPage({ name: pageName, data: pageData });
    } else {
      setError('Page not found');
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

### Delete Page
```
async (pageName) => {
  if (!confirm(`Are you sure you want to delete "${pageName}"?`)) {
    return;
  }

  try {
    await contentManager.deletePage(owner, repo, pageName, `Delete page: ${pageName}`);

    // Reload page list
    const pageList = await contentManager.listPages(owner, repo);
    setPages(pageList);
  } catch (err) {
    setError(err.message);
  }
}
```

### Duplicate Page
```
async (pageName) => {
  const newName = prompt('Enter name for duplicated page:', `${pageName}-copy`);
  if (!newName) return;

  try {
    // Load original page
    const pageData = await contentManager.loadPage(owner, repo, pageName);

    // Update name and title
    const duplicatedData = {
      ...pageData,
      name: newName,
      title: newName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };

    // Save as new page
    await contentManager.savePage(owner, repo, newName, duplicatedData, `Duplicate page: ${pageName} -> ${newName}`);

    // Reload page list
    const pageList = await contentManager.listPages(owner, repo);
    setPages(pageList);
  } catch (err) {
    setError(err.message);
  }
}
```

## DOM Structure
```
<div class="page-manager">
  <div class="page-manager-header">
    <h2>Pages</h2>
    <button onClick={() => setCreating(true)}>
      + New Page
    </button>
  </div>

  {creating && (
    <div class="page-manager-create">
      <input
        type="text"
        placeholder="page-name"
        value={newPageName}
        onChange={(e) => setNewPageName(e.target.value.toLowerCase())}
      />
      <button onClick={() => createPage(newPageName)}>Create</button>
      <button onClick={() => setCreating(false)}>Cancel</button>
    </div>
  )}

  {error && (
    <div class="page-manager-error">
      {error}
      <button onClick={() => setError(null)}>Dismiss</button>
    </div>
  )}

  {loading ? (
    <div class="page-manager-loading">Loading pages...</div>
  ) : (
    <div class="page-manager-list">
      {pages.map(page => (
        <div key={page} class="page-card">
          <div class="page-card-preview">
            {/* Thumbnail or icon */}
          </div>
          <div class="page-card-info">
            <h3>{page}</h3>
          </div>
          <div class="page-card-actions">
            <button onClick={() => selectPage(page)}>Edit</button>
            <button onClick={() => duplicatePage(page)}>Duplicate</button>
            <button onClick={() => deletePage(page)}>Delete</button>
          </div>
        </div>
      ))}

      {pages.length === 0 && (
        <div class="page-manager-empty">
          No pages yet. Create your first page!
        </div>
      )}
    </div>
  )}
</div>
```

## Page Name Validation
- Lowercase letters, numbers, hyphens, underscores only
- No spaces
- Cannot start with hyphen or number
- Minimum 1 character
- Maximum 50 characters
- Cannot be empty

## Default Page Structure
When creating a new page, use this default structure:
```
{
  name: "page-name",
  title: "Page Name",
  components: [
    {
      id: "root-{timestamp}",
      type: "Container",
      props: { maxWidth: "1200px" },
      style: {},
      children: [
        {
          id: "heading-{timestamp}",
          type: "Heading",
          props: { level: 1, text: "Welcome to Page Name" },
          style: {},
          children: []
        }
      ]
    }
  ]
}
```

## Default Export
Export the PageManager component as default export.

## Implementation Notes
- Sort pages alphabetically
- Cache page list to reduce API calls
- Show loading states during async operations
- Confirm destructive actions (delete)
- Validate page names before creation
- Auto-lowercase page name inputs
- Handle empty page list gracefully
- Show error messages inline
- Provide retry mechanism for failed operations
- Consider pagination if many pages exist
- Show page metadata (created date, modified date, author)
- Support filtering/searching pages
- Highlight currently selected page
