# Router Component

## Purpose
Client-side hash router for the public site. Loads and displays pages based on URL hash.

## Component Type
React functional component

## Dependencies
- Renderer.md for rendering page content
- contentManager.md for loading pages

## Props
- `owner` (string): GitHub repository owner
- `repo` (string): Repository name
- `defaultPage` (string, optional): Default page to load (default: 'home')

## State Management
Use React useState for:
- `currentPage` (object|null): Currently loaded page data
- `loading` (boolean): Loading state
- `error` (string|null): Error message
- `notFound` (boolean): 404 state

## Routing Logic
Use hash-based routing:
- `#/` or `#/home` → Load 'home' page
- `#/about` → Load 'about' page
- `#/contact` → Load 'contact' page
- etc.

Parse hash to determine page name:
```
const getPageNameFromHash = () => {
  const hash = window.location.hash;

  // Remove '#/' prefix
  const pageName = hash.replace(/^#\/?/, '') || defaultPage;

  return pageName;
};
```

## Lifecycle

### On Mount (useEffect)
```
useEffect(() => {
  const loadPage = async () => {
    const pageName = getPageNameFromHash();

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const pageData = await contentManager.loadPage(owner, repo, pageName);

      if (pageData) {
        setCurrentPage(pageData);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load page on mount
  loadPage();

  // Listen for hash changes
  const handleHashChange = () => {
    loadPage();
  };

  window.addEventListener('hashchange', handleHashChange);

  return () => {
    window.removeEventListener('hashchange', handleHashChange);
  };
}, [owner, repo, defaultPage]);
```

## Rendering Logic

### Loading State
```
if (loading) {
  return (
    <div class="router-loading">
      <div class="spinner"></div>
      <p>Loading page...</p>
    </div>
  );
}
```

### Error State
```
if (error) {
  return (
    <div class="router-error">
      <h1>Error</h1>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}
```

### 404 Not Found
```
if (notFound) {
  return (
    <div class="router-404">
      <h1>404</h1>
      <p>Page not found</p>
      <a href="#/">Go to home page</a>
    </div>
  );
}
```

### Success State
```
if (currentPage) {
  return (
    <div class="router">
      <Renderer pageData={currentPage} mode="view" />
    </div>
  );
}
```

## DOM Structure
```
<div class="router">
  {loading && <LoadingView />}
  {error && <ErrorView error={error} />}
  {notFound && <NotFoundView />}
  {currentPage && <Renderer pageData={currentPage} mode="view" />}
</div>
```

## Page Transition
Optional: Add fade transition between page loads:
```
<div class={`router ${loading ? 'loading' : 'loaded'}`}>
  ...
</div>
```

With CSS:
```
.router {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.router.loading {
  opacity: 0.5;
}
```

## Page Title
Update document title based on page:
```
useEffect(() => {
  if (currentPage && currentPage.title) {
    document.title = currentPage.title;
  }
}, [currentPage]);
```

## Metadata
Set page metadata from page data:
```
useEffect(() => {
  if (currentPage && currentPage.meta) {
    // Update meta tags
    const description = document.querySelector('meta[name="description"]');
    if (description && currentPage.meta.description) {
      description.setAttribute('content', currentPage.meta.description);
    }

    // Update other meta tags as needed
  }
}, [currentPage]);
```

## Navigation Links
Provide helper for navigation:
```
const navigateToPage = (pageName) => {
  window.location.hash = `#/${pageName}`;
};
```

## Default Page
If no hash provided, load default page:
```
const defaultPage = props.defaultPage || 'home';
```

## Error Recovery
Provide retry mechanism:
```
const handleRetry = () => {
  setError(null);
  setNotFound(false);
  window.location.reload();
};
```

## Cache
Optional: Cache loaded pages to reduce API calls:
```
const pageCache = useRef({});

const loadPageWithCache = async (pageName) => {
  if (pageCache.current[pageName]) {
    return pageCache.current[pageName];
  }

  const pageData = await contentManager.loadPage(owner, repo, pageName);
  pageCache.current[pageName] = pageData;

  return pageData;
};
```

## Scroll Behavior
Reset scroll position on page change:
```
useEffect(() => {
  window.scrollTo(0, 0);
}, [currentPage]);
```

## Default Export
Export the Router component as default export.

## Implementation Notes
- Use hash routing to avoid server configuration
- Handle invalid page names gracefully
- Provide clear error messages
- Show loading state for better UX
- Support browser back/forward navigation
- Update page title and meta tags
- Cache pages for performance
- Handle offline scenarios
- Support deep linking
- Validate page data structure before rendering
- Log navigation events for analytics
- Support query parameters in hash (optional)
- Handle special characters in page names
- Provide breadcrumbs or navigation context
- Support programmatic navigation
