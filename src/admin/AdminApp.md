# AdminApp Component

## Purpose
Main admin interface layout and router with modern, cohesive design. Coordinates all admin components and manages application state with elegant visual hierarchy and smooth transitions.

## Component Type
React functional component

## Dependencies
- Auth.md for authentication
- PageManager.md for page management
- Builder.md for page building
- PropsEditor.md for props editing
- StyleEditor.md for style editing
- ComponentCreator.md for custom components
- PublishManager.md for publishing
- liveReload.md for auto-refresh
- contentManager.md for content operations
- componentRegistry.md for component schemas

## State Management
Use React useState for:
- `currentRoute` (string): Current route (/admin, /admin/pages/:name, /admin/components, /admin/settings)
- `currentPage` (object|null): Currently loaded page { name, data }
- `selectedComponentId` (string|null): Selected component in builder
- `changes` (array): Tracked changes for publishing
- `repoInfo` (object): { owner, repo } from environment
- `syncStatus` (object): { lastSync, online, hasRemoteChanges }
- `showNotification` (boolean): Show notification for remote changes

## Lifecycle

### On Mount (useEffect)
1. Load repository info from environment variables
2. Check authentication status
3. Load current route from localStorage or URL hash
4. Start live reload watcher
5. Load any custom component schemas from repo

### On Unmount
Stop live reload watcher

## Routing Logic
Use hash-based routing:
- `#/admin` → Pages view (PageManager)
- `#/admin/pages/:pageName` → Builder view
- `#/admin/components` → Component creator view
- `#/admin/settings` → Settings view

Parse hash on mount and hash change:
```
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash;
    setCurrentRoute(hash);

    // Wait for repo info to be loaded from environment
    if (!repoInfo.owner || !repoInfo.repo) return;

    // Parse route params
    if (hash.startsWith('#/admin/pages/')) {
      const pageName = hash.split('/')[3];
      loadPage(pageName);
    }
  };

  window.addEventListener('hashchange', handleHashChange);

  // Only call initial load if repoInfo is ready
  if (repoInfo.owner && repoInfo.repo) {
    handleHashChange();
  }

  return () => window.removeEventListener('hashchange', handleHashChange);
}, [repoInfo]);
```

## Layout Structure
```
<div class="admin-app">
  <header class="admin-header">
    <div class="admin-header-left">
      <h1 class="admin-logo">CMS Admin</h1>
      <nav class="admin-nav">
        <a href="#/admin">Pages</a>
        <a href="#/admin/components">Components</a>
        <a href="#/admin/settings">Settings</a>
      </nav>
    </div>

    <div class="admin-header-right">
      <div class="sync-status">
        {syncStatus.online ? (
          <>
            <span class="status-indicator online"></span>
            Last sync: {formatTime(syncStatus.lastSync)}
          </>
        ) : (
          <>
            <span class="status-indicator offline"></span>
            Offline
          </>
        )}
      </div>

      <Auth />
    </div>
  </header>

  {showNotification && (
    <div class="admin-notification">
      <span>New changes detected in repository</span>
      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={() => setShowNotification(false)}>Dismiss</button>
    </div>
  )}

  <main class="admin-main">
    {renderCurrentView()}
  </main>
</div>
```

## View Rendering

### renderCurrentView()
```
() => {
  const route = currentRoute;

  if (route === '#/admin' || route === '') {
    return (
      <PageManager
        owner={repoInfo.owner}
        repo={repoInfo.repo}
        onSelectPage={handleSelectPage}
      />
    );
  }

  if (route.startsWith('#/admin/pages/')) {
    if (!currentPage) {
      return <div>Loading page...</div>;
    }

    return (
      <div class="builder-layout">
        <div class="builder-main">
          <Builder
            pageData={currentPage.data}
            onUpdate={handlePageUpdate}
          />
        </div>

        <div class="builder-sidebar">
          {selectedComponentId && (
            <>
              <PropsEditor
                component={getComponentById(selectedComponentId)}
                schema={getComponentSchema(selectedComponentId)}
                onChange={handlePropsChange}
              />

              <StyleEditor
                style={getComponentById(selectedComponentId).style}
                onChange={handleStyleChange}
              />
            </>
          )}

          <PublishManager
            owner={repoInfo.owner}
            repo={repoInfo.repo}
            changes={changes}
          />
        </div>
      </div>
    );
  }

  if (route === '#/admin/components') {
    return (
      <ComponentCreator
        owner={repoInfo.owner}
        repo={repoInfo.repo}
        onComponentCreated={handleComponentCreated}
      />
    );
  }

  if (route === '#/admin/settings') {
    return <SettingsView repoInfo={repoInfo} />;
  }

  return <div>404 - Route not found</div>;
}
```

## Event Handlers

### handleSelectPage(page)
```
(page) => {
  setCurrentPage(page);
  window.location.hash = `#/admin/pages/${page.name}`;
  localStorage.setItem('lastPage', page.name);
}
```

### handlePageUpdate(updatedPageData)
```
(updatedPageData) => {
  setCurrentPage({ ...currentPage, data: updatedPageData });

  // Track change
  addChange({
    path: `/content/pages/${currentPage.name}.json`,
    status: 'modified',
    content: JSON.stringify(updatedPageData, null, 2)
  });
}
```

### handlePropsChange(updatedProps)
```
(updatedProps) => {
  const updatedPageData = updateComponentProps(
    currentPage.data,
    selectedComponentId,
    updatedProps
  );
  handlePageUpdate(updatedPageData);
}
```

### handleStyleChange(updatedStyle)
```
(updatedStyle) => {
  const updatedPageData = updateComponentStyle(
    currentPage.data,
    selectedComponentId,
    updatedStyle
  );
  handlePageUpdate(updatedPageData);
}
```

### handleComponentCreated(componentName)
```
(componentName) => {
  // Reload component registry
  loadCustomComponents();

  // Show success message
  alert(`Component "${componentName}" created successfully!`);

  // Optionally navigate back to pages
  window.location.hash = '#/admin';
}
```

### handleRefresh()
```
async () => {
  // Reload current page from GitHub
  if (currentPage) {
    const fresh = await contentManager.loadPage(
      repoInfo.owner,
      repoInfo.repo,
      currentPage.name
    );
    setCurrentPage({ ...currentPage, data: fresh });
  }

  setShowNotification(false);
  updateSyncStatus();
}
```

## Live Reload Integration
```
useEffect(() => {
  if (!repoInfo.owner || !repoInfo.repo) return;

  liveReload.startWatching(repoInfo.owner, repoInfo.repo, (newCommits) => {
    console.log('New commits detected:', newCommits);
    setSyncStatus({ ...syncStatus, hasRemoteChanges: true });
    setShowNotification(true);
  });

  return () => {
    liveReload.stopWatching();
  };
}, [repoInfo]);
```

## Change Tracking
Maintain array of changes for publish manager:
```
const addChange = (change) => {
  setChanges(prevChanges => {
    // Remove existing change for same path
    const filtered = prevChanges.filter(c => c.path !== change.path);
    return [...filtered, change];
  });
};
```

## Repository Info
Load from environment variables:
```
const repoInfo = {
  owner: import.meta.env.VITE_GITHUB_OWNER || '',
  repo: import.meta.env.VITE_GITHUB_REPO || ''
};
```

Or allow user configuration in settings.

## Persistence
Save to localStorage:
- Last opened page
- Current route
- User preferences
- Draft changes (optional)

## Helper Functions

### getComponentById(id)
Recursively find component in page tree by ID.

### updateComponentProps(pageData, componentId, newProps)
Update props for specific component, return new page data.

### updateComponentStyle(pageData, componentId, newStyle)
Update style for specific component, return new page data.

### loadCustomComponents()
Load custom component schemas from repo and register them.

### updateSyncStatus()
Update sync status based on GitHub API.

## Settings View
Simple settings form:
- Repository owner/name (if not in env)
- Default page
- Theme preferences
- Export/import data

## Default Export
Export the AdminApp component as default export.

## Implementation Notes
- Use hash routing for simplicity (no server config needed)
- Persist state to localStorage
- Handle authentication redirects gracefully
- Show loading states during async operations
- Provide keyboard shortcuts for common actions
- Implement auto-save for draft changes
- Handle network errors and offline mode
- Show helpful onboarding for first-time users
- Provide tooltips and help text
- Support multiple repositories (advanced)
- Implement role-based access control (optional)
- Log user actions for debugging
- Optimize re-renders with React.memo and useMemo
- Handle concurrent edits (last write wins for now)
