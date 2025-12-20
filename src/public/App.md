# Public App Component

## Purpose
Entry point for the public-facing website. Routes between admin interface and public site, loads repository configuration, and provides global app context.

## Component Type
React functional component

## Dependencies
- Router.md for public site routing
- AdminApp.md for admin interface

## State Management
Use React useState for:
- `isAdminRoute` (boolean): Whether current route is admin
- `repoInfo` (object): Repository configuration { owner, repo }
- `loading` (boolean): Initial loading state

## Configuration
Load repository info from environment variables:
```
const repoInfo = {
  owner: import.meta.env.VITE_GITHUB_OWNER || '',
  repo: import.meta.env.VITE_GITHUB_REPO || ''
};
```

Fallback: Allow configuration via localStorage or query params:
```
const getRepoInfo = () => {
  // Try environment variables first
  let owner = import.meta.env.VITE_GITHUB_OWNER;
  let repo = import.meta.env.VITE_GITHUB_REPO;

  // Fallback to localStorage
  if (!owner || !repo) {
    owner = localStorage.getItem('github_owner');
    repo = localStorage.getItem('github_repo');
  }

  // Fallback to URL params (for demo/testing)
  if (!owner || !repo) {
    const params = new URLSearchParams(window.location.search);
    owner = params.get('owner');
    repo = params.get('repo');

    if (owner && repo) {
      // Save to localStorage for future
      localStorage.setItem('github_owner', owner);
      localStorage.setItem('github_repo', repo);
    }
  }

  return { owner, repo };
};
```

## Route Detection
Determine if current route is admin:
```
const checkIsAdminRoute = () => {
  const path = window.location.pathname;
  const hash = window.location.hash;

  // Check if path or hash includes /admin
  return path.includes('/admin') || hash.includes('/admin');
};
```

## Lifecycle

### On Mount (useEffect)
```
useEffect(() => {
  // Detect admin route
  const isAdmin = checkIsAdminRoute();
  setIsAdminRoute(isAdmin);

  // Listen for hash/path changes
  const handleRouteChange = () => {
    const isAdmin = checkIsAdminRoute();
    setIsAdminRoute(isAdmin);
  };

  window.addEventListener('hashchange', handleRouteChange);
  window.addEventListener('popstate', handleRouteChange);

  return () => {
    window.removeEventListener('hashchange', handleRouteChange);
    window.removeEventListener('popstate', handleRouteChange);
  };
}, []);
```

## Rendering Logic

### No Repository Configuration
```
if (!repoInfo.owner || !repoInfo.repo) {
  return (
    <div class="app-config">
      <h1>Configuration Required</h1>
      <p>Please configure your GitHub repository:</p>
      <form onSubmit={handleConfigSubmit}>
        <input
          type="text"
          placeholder="Repository Owner"
          name="owner"
          required
        />
        <input
          type="text"
          placeholder="Repository Name"
          name="repo"
          required
        />
        <button type="submit">Save</button>
      </form>
      <p class="hint">
        Or set VITE_GITHUB_OWNER and VITE_GITHUB_REPO environment variables
      </p>
    </div>
  );
}
```

### Admin Route
```
if (isAdminRoute) {
  return <AdminApp owner={repoInfo.owner} repo={repoInfo.repo} />;
}
```

### Public Route
```
return (
  <Router
    owner={repoInfo.owner}
    repo={repoInfo.repo}
    defaultPage="home"
  />
);
```

## DOM Structure
```
<div class="app">
  {!repoInfo.owner || !repoInfo.repo ? (
    <ConfigurationView />
  ) : isAdminRoute ? (
    <AdminApp owner={repoInfo.owner} repo={repoInfo.repo} />
  ) : (
    <Router owner={repoInfo.owner} repo={repoInfo.repo} defaultPage="home" />
  )}
</div>
```

## Configuration Form Handler
```
const handleConfigSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const owner = formData.get('owner');
  const repo = formData.get('repo');

  if (owner && repo) {
    localStorage.setItem('github_owner', owner);
    localStorage.setItem('github_repo', repo);

    setRepoInfo({ owner, repo });
  }
};
```

## Admin Access
Provide easy way to access admin:
- Link in footer: "Admin" (only visible when authenticated)
- Direct navigation to #/admin
- Keyboard shortcut: Ctrl+Shift+A (optional)

## Global Styles
Apply global CSS reset and base styles:
```
useEffect(() => {
  // Apply global styles to body
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
}, []);
```

## Error Boundary
Wrap app in error boundary:
```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div class="app-error">
          <h1>Something went wrong</h1>
          <pre>{this.state.error?.message}</pre>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap App in ErrorBoundary
const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

## Loading State
Show loading screen while initializing:
```
if (loading) {
  return (
    <div class="app-loading">
      <div class="spinner"></div>
      <p>Initializing...</p>
    </div>
  );
}
```

## Context Providers
Provide global context for repository info:
```
import { createContext, useContext } from 'react';

export const RepoContext = createContext(null);

export const useRepo = () => useContext(RepoContext);

// In App component:
<RepoContext.Provider value={repoInfo}>
  {isAdminRoute ? <AdminApp /> : <Router />}
</RepoContext.Provider>
```

## Default Export
Export the App component as default export (or AppWithErrorBoundary).

## Implementation Notes
- Support both hash routing and path routing
- Handle missing configuration gracefully
- Provide clear setup instructions
- Validate repository info before using
- Cache repository info in localStorage
- Support URL-based configuration for demos
- Handle authentication state globally
- Provide theme support (light/dark mode)
- Support internationalization (i18n) if needed
- Implement analytics tracking
- Handle offline mode
- Provide global loading indicators
- Support keyboard navigation
- Ensure responsive design
- Handle browser compatibility
