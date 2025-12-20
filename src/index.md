# React App Entry Point

Main entry point for both admin and public site. Routes based on current URL path.

## Functionality

### URL Detection
- If current path includes `/admin`: render AdminApp (editing interface)
- Otherwise: render public App (site viewer)

### Initialization
- Load environment variables (client ID, repo owner, repo name)
- Initialize component registry with base components
- Setup React Router context
- Mount React app to #root element in index.html

### Component Mounting
```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {pathIncludesAdmin ? <AdminApp /> : <App />}
  </React.StrictMode>
)
```

### Error Handling
- Catch render errors and display fallback UI
- Show error message with reload button
- Log errors to console for debugging

### Base Setup
- Import necessary React and ReactDOM libraries
- Import AdminApp from admin/AdminApp
- Import App from public/App
- Determine current path from window.location.pathname

### Performance
- Code-split admin and public routes (separate bundles)
- Lazy load heavy components
- Minimize bundle size for faster GitHub Pages load time
