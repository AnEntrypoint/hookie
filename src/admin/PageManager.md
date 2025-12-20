# PageManager Component

Modern admin panel for managing website pages with elegant grid layout and smooth interactions.

## Purpose
Manages page list, creation, deletion, and selection. Provides intuitive UI for navigating between pages in the CMS with drag-and-drop support.

## Component Type
React functional component with hooks

## Dependencies
- contentManager.md for page operations
- Global design system from index.md

## Props
- `owner` (string): GitHub repository owner
- `repo` (string): Repository name
- `onSelectPage` (function): Callback when page is selected
  - Signature: `(page: { name, data }) => void`

## Design Specifications

### Layout
- Container: Full width, max-width 1400px, centered
- Padding: 32px top/bottom, 24px left/right
- Background: White (#ffffff)
- Border-radius: 12px

### Header
- Display: flex, space-between, align items center
- Padding: 24px
- Border-bottom: 1px solid #e2e8f0
- Background: #f8fafc
- H2 color: #1e293b
- H2 font-size: 1.75rem, weight 700

### Page Grid
- Display: CSS Grid (responsive)
- Columns: auto-fit, minmax(280px, 1fr)
- Gap: 20px
- Padding: 24px
- Min height: 400px

## State Management
Use React useState for:
- `pages` (array): List of page objects with metadata
- `loading` (boolean): Loading state
- `creating` (boolean): Creating new page state
- `newPageName` (string): Name input for new page
- `error` (string|null): Error message with status
- `selectedPage` (string|null): Currently selected page highlight

## Lifecycle
On component mount (useEffect):
1. Load list of pages using contentManager.listPages(owner, repo)
2. Populate pages with metadata (created, modified dates)
3. Set pages state and clear loading
4. Handle loading and error states gracefully

## Rendering Logic

### Loading State
- Centered spinner with animated rotation
- Text: "Loading pages..."
- Color: #2563eb
- Size: 48px × 48px
- Animation: 1s rotation, infinite

### Error State
- Background: #fecaca (red-200)
- Border: 1px solid #ef4444
- Border-radius: 8px
- Padding: 16px
- Text color: #991b1b (red-900)
- Dismiss button: Red pill-shaped, right-aligned
- Box-shadow: subtle

### New Page Form
- Modal-style overlay with backdrop blur
- Background: White card with shadow
- Padding: 32px
- Border-radius: 12px
- Max-width: 500px
- Title: "Create New Page" (24px, bold, dark text)
- Input styling:
  - Border: 1px solid #e2e8f0
  - Padding: 12px
  - Border-radius: 8px
  - Font-size: 1rem
  - Focus: border #2563eb, box-shadow blue
  - Full width
  - Placeholder: #94a3b8
- Button layout: flex gap 12px, justify-end
- Create Button: Primary blue (#2563eb), white text
- Cancel Button: Ghost style, gray text (#64748b)

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

### Page Card Design
- Background: White (#ffffff)
- Border: 1px solid #e2e8f0
- Border-radius: 12px
- Padding: 20px
- Box-shadow: medium
- Hover: box-shadow large, transform translateY(-2px), transition smooth
- Display: flex flex-direction column gap 16px

#### Card Preview Area
- Height: 120px
- Background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)
- Border-radius: 8px
- Display: flex align-center justify-center
- Icon: Document icon (#2563eb), size 48px

#### Card Info
- Title: #1e293b, 1.125rem, weight 600
- Meta: #64748b, 0.875rem, weight 400
- Spacing: 8px between elements

#### Card Actions
- Display: flex gap 8px
- Button styling: See button spec below
- Edit button: Primary blue
- Duplicate button: Secondary gray
- Delete button: Danger red/outlined

### Page Card Empty State
- Text: "No pages yet. Create your first page!"
- Color: #64748b
- Font-size: 1rem
- Padding: 48px
- Text-align: center
- Border: 2px dashed #cbd5e1
- Border-radius: 8px

## DOM Structure
```jsx
<div style={styles.container}>
  <div style={styles.header}>
    <h2 style={styles.title}>Pages</h2>
    <button
      style={styles.primaryButton}
      onClick={() => setCreating(true)}
    >
      + New Page
    </button>
  </div>

  {creating && (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalCard}>
        <h3 style={styles.modalTitle}>Create New Page</h3>
        <input
          style={styles.input}
          type="text"
          placeholder="page-name"
          value={newPageName}
          onChange={(e) => setNewPageName(e.target.value.toLowerCase())}
          autoFocus
        />
        <div style={styles.modalActions}>
          <button
            style={styles.primaryButton}
            onClick={() => createPage(newPageName)}
          >
            Create
          </button>
          <button
            style={styles.ghostButton}
            onClick={() => setCreating(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

  {error && (
    <div style={styles.errorAlert}>
      <span>{error}</span>
      <button
        style={styles.closeButton}
        onClick={() => setError(null)}
      >
        ✕
      </button>
    </div>
  )}

  {loading ? (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner} />
      <p>Loading pages...</p>
    </div>
  ) : (
    <div style={styles.gridContainer}>
      {pages.length === 0 ? (
        <div style={styles.emptyState}>
          No pages yet. Create your first page!
        </div>
      ) : (
        pages.map(page => (
          <div key={page} style={styles.pageCard}>
            <div style={styles.cardPreview}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div style={styles.cardInfo}>
              <h3 style={styles.cardTitle}>{page}</h3>
            </div>
            <div style={styles.cardActions}>
              <button
                style={styles.primaryButton}
                onClick={() => selectPage(page)}
              >
                Edit
              </button>
              <button
                style={styles.secondaryButton}
                onClick={() => duplicatePage(page)}
              >
                Duplicate
              </button>
              <button
                style={styles.dangerButton}
                onClick={() => deletePage(page)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )}
</div>
```

## Button Styles

### Primary Button
- Background: #2563eb
- Color: white
- Padding: 10px 16px
- Font-size: 0.875rem
- Border: none
- Border-radius: 8px
- Cursor: pointer
- Transition: 150ms ease-in-out
- Hover: background #1e40af, box-shadow medium
- Active: background #1e3a8a
- Disabled: background #cbd5e1, cursor not-allowed

### Secondary Button
- Background: #f1f5f9
- Color: #64748b
- Padding: 10px 16px
- Font-size: 0.875rem
- Border: 1px solid #e2e8f0
- Border-radius: 8px
- Cursor: pointer
- Transition: 150ms ease-in-out
- Hover: background #e2e8f0, color #1e293b

### Danger Button
- Background: transparent
- Color: #ef4444
- Padding: 10px 16px
- Font-size: 0.875rem
- Border: 1px solid #fecaca
- Border-radius: 8px
- Cursor: pointer
- Transition: 150ms ease-in-out
- Hover: background #fee2e2

### Ghost Button
- Background: transparent
- Color: #64748b
- Padding: 10px 16px
- Border: none
- Border-radius: 8px
- Cursor: pointer
- Transition: 150ms ease-in-out
- Hover: background #f1f5f9

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
