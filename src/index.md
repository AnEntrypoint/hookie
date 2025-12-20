# React App Entry Point

Modern, fully-featured dynamic CMS application with sleek admin interface and beautiful public site renderer.

## Global Design System

### Color Palette
- **Primary**: #2563eb (Modern Blue)
- **Primary Dark**: #1e40af (Deep Blue)
- **Primary Light**: #dbeafe (Light Blue)
- **Accent**: #f59e0b (Amber)
- **Success**: #10b981 (Emerald)
- **Danger**: #ef4444 (Red)
- **Dark Background**: #0f172a (Slate 900)
- **Light Background**: #f8fafc (Slate 50)
- **Border**: #e2e8f0 (Slate 200)
- **Text Dark**: #1e293b (Slate 900)
- **Text Light**: #64748b (Slate 500)
- **Text Muted**: #94a3b8 (Slate 400)

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif
- **H1**: 2.5rem (40px), weight 700, line-height 1.2
- **H2**: 2rem (32px), weight 700, line-height 1.3
- **H3**: 1.5rem (24px), weight 600, line-height 1.4
- **Body**: 1rem (16px), weight 400, line-height 1.6
- **Small**: 0.875rem (14px), weight 400, line-height 1.5
- **Monospace**: 'Monaco', 'Courier New', monospace

### Spacing
- Base unit: 4px (multiples of 4: 4, 8, 12, 16, 24, 32, 48, 64)
- Padding: 16px (standard)
- Margin: 24px (vertical), 16px (horizontal)
- Gap: 12px (components), 24px (sections)

### Shadows
- **Subtle**: 0 1px 2px rgba(0,0,0,0.05)
- **Small**: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
- **Medium**: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
- **Large**: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
- **XL**: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)

### Border Radius
- Small: 4px
- Medium: 8px
- Large: 12px
- Full: 9999px

### Transitions
- Fast: 150ms ease-in-out
- Normal: 200ms ease-in-out
- Slow: 300ms ease-in-out

## Functionality

### URL Detection
- If current path includes `/admin`: render AdminApp (admin editing interface with modern sidebar)
- Otherwise: render public App (beautifully designed site viewer)

### Global Styles
- Root element: Apply system font, smooth antialiasing, base text color
- Light theme by default with dark backgrounds for admin
- Consistent spacing and typography throughout
- Smooth transitions on all interactive elements

### Initialization
- Load environment variables (client ID, repo owner, repo name)
- Initialize component registry with all styled base components
- Setup global CSS variables for theme colors
- Mount React app to #root element with global styles

### Component Mounting
```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyles />
    {pathIncludesAdmin ? <AdminApp /> : <App />}
  </React.StrictMode>
)
```

### Error Handling
- Catch render errors and display elegant error overlay
- Show error message with styled reload button
- Dark background with readable error text
- Log errors to console for debugging

### Global CSS
- CSS Variables for all colors and spacing
- Normalize styles across browsers
- Smooth font rendering
- Base form input styling
- Button reset styles
- Link styling with hover effects

### Performance
- Code-split admin and public routes (separate bundles)
- Lazy load heavy components
- CSS-in-JS for scoped styling
- Minimize bundle size for faster GitHub Pages load time

<!-- Regenerated -->
