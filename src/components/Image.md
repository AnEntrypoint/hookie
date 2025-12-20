# Image Component

Responsive image component with elegant styling, lazy loading support, and accessibility features.

## Purpose
Displays images with configurable dimensions, styling, and optional lazy loading. Handles responsive behavior and provides accessible alt text support.

## Component Type
React functional component

## Props
- `src` (string, required): Image source URL
- `alt` (string, optional): Alternative text for accessibility. Default: 'Image'
- `width` (string, optional): CSS width value. Default: 'auto'
- `height` (string, optional): CSS height value. Default: 'auto'
- `borderRadius` (string, optional): Border radius value ('sm'|'md'|'lg'|'full'). Default: 'md'
- `objectFit` (string, optional): CSS object-fit value ('cover'|'contain'|'fill'). Default: 'cover'
- `lazy` (boolean, optional): Enable lazy loading. Default: true
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Border Radius Options
- **sm**: 6px
- **md**: 12px (default, more modern)
- **lg**: 16px
- **full**: 9999px

### Image Styling
- Display: block (removes inline spacing)
- Max-width: 100% (responsive)
- Height: auto (maintains aspect ratio by default)
- Object-fit: cover (default, fills container)
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)

### Shadow
- Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) (elegant depth)
- Transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)

### Hover Effects
- Box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) (lifted effect)
- Transform: scale(1.03) translateY(-4px) (elevated zoom)
- Smooth transition

## Rendering Logic
1. Create img element with className 'image'
2. Set src attribute from props.src
3. Set alt attribute from props.alt (required for accessibility)
4. Apply inline styles:
   - Width and height from props
   - Border-radius from borderRadius prop
   - Object-fit from objectFit prop
   - Display: block
   - Max-width: 100%
   - Merge with props.style
5. Add loading="lazy" if lazy prop is true
6. Render the image element

## DOM Structure
```jsx
<img
  className="image"
  src={props.src}
  alt={props.alt || 'Image'}
  loading={props.lazy ? 'lazy' : 'eager'}
  style={{
    display: 'block',
    width: props.width || 'auto',
    height: props.height || 'auto',
    maxWidth: '100%',
    borderRadius: getBorderRadius(props.borderRadius),
    objectFit: props.objectFit || 'cover',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'box-shadow 150ms ease-in-out',
    ...props.style
  }}
/>
```

## Default Export
Export the Image component as default export.

## Implementation Notes
- Use native img element
- Include alt text for accessibility (required)
- max-width: 100% prevents overflow in containers
- display: block removes inline spacing issues
- Lazy loading enabled by default for performance
- Support object-fit for responsive image scaling
- Smooth hover effects with transitions
- Handle missing images gracefully with browser default
- Responsive by default with max-width constraint
