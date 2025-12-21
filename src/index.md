# React App Entry Point

Modern, fully-featured dynamic CMS application with sleek admin interface and beautiful public site renderer.

## Global Design System

### Color Palette
- **Primary**: #2563eb (Modern Blue)
- **Primary Dark**: #1e40af (Deep Blue)
- **Primary Light**: #dbeafe (Light Blue)
- **Primary Darker**: #1e3a8a (Ultra Deep Blue)
- **Accent**: #f59e0b (Amber)
- **Success**: #10b981 (Emerald)
- **Success Light**: #d1fae5 (Light Emerald)
- **Danger**: #ef4444 (Red)
- **Danger Dark**: #dc2626 (Deep Red)
- **Danger Light**: #fee2e2 (Light Red)
- **Dark Background**: #0f172a (Slate 900)
- **Light Background**: #f8fafc (Slate 50)
- **Subtle Background**: #f1f5f9 (Slate 100)
- **Border**: #e2e8f0 (Slate 200)
- **Border Dark**: #cbd5e1 (Slate 300)
- **Text Dark**: #1e293b (Slate 900)
- **Text Light**: #64748b (Slate 500)
- **Text Muted**: #94a3b8 (Slate 400)
- **Text Muted Light**: #cbd5e1 (Slate 300)
- **Glass Effect**: rgba(255, 255, 255, 0.8)

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif
- **H1**: 2.5rem (40px), weight 700, line-height 1.2, letter-spacing -0.5px
- **H2**: 2rem (32px), weight 700, line-height 1.3, letter-spacing -0.3px
- **H3**: 1.5rem (24px), weight 600, line-height 1.4, letter-spacing -0.2px
- **H4**: 1.25rem (20px), weight 600, line-height 1.5
- **Body**: 1rem (16px), weight 400, line-height 1.6
- **Small**: 0.875rem (14px), weight 400, line-height 1.5
- **XSmall**: 0.75rem (12px), weight 500, line-height 1.4
- **Monospace**: 'Monaco', 'Courier New', monospace
- **Letter Spacing**: 0.4px for emphasis, -0.3px for headlines

### Spacing
- Base unit: 4px (multiples of 4: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80)
- Padding: 16px (standard), 24px (generous), 32px (spacious)
- Margin: 24px (vertical), 16px (horizontal), 32px (section breaks)
- Gap: 12px (components), 16px (cards), 24px (sections), 32px (major sections)

### Shadows
- **Subtle**: 0 1px 2px rgba(0,0,0,0.05)
- **Small**: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
- **Medium**: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
- **Large**: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
- **XL**: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
- **Elevation High**: 0 25px 50px rgba(0,0,0,0.15), 0 15px 20px rgba(0,0,0,0.08)
- **Inset Subtle**: inset 0 1px 2px rgba(0,0,0,0.05)

### Border Radius
- XS: 2px
- Small: 4px
- Medium: 8px
- Large: 12px
- XLarge: 16px
- Full: 9999px

### Transitions
- Instant: 0ms
- Fast: 100ms cubic-bezier(0.4, 0, 0.2, 1)
- Normal: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- Smooth: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)

### Effects & Filters
- **Blur Light**: blur(4px)
- **Blur Medium**: blur(8px)
- **Backdrop Blur**: backdrop-filter blur(12px)
- **Brightness Hover**: brightness(1.05)
- **Saturation Hover**: saturate(1.1)

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
