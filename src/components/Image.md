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
- `borderRadius` (string, optional): Border radius value ('xs'|'sm'|'md'|'lg'|'xl'|'full'). Default: 'md'
- `objectFit` (string, optional): CSS object-fit value ('cover'|'contain'|'fill'|'scale-down'). Default: 'cover'
- `objectPosition` (string, optional): CSS object-position value. Default: 'center'
- `lazy` (boolean, optional): Enable lazy loading. Default: true
- `shadow` (string, optional): Shadow intensity ('none'|'sm'|'md'|'lg'|'xl'). Default: 'md'
- `effect` (string, optional): Hover effect ('none'|'lift'|'zoom'|'glow'). Default: 'lift'
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Border Radius Options
- **xs**: 4px
- **sm**: 8px
- **md**: 12px (default, modern)
- **lg**: 16px
- **xl**: 20px
- **full**: 9999px

### Image Styling
- Display: block (removes inline spacing)
- Max-width: 100% (responsive)
- Height: auto (maintains aspect ratio by default)
- Object-fit: cover (default, fills container)
- Object-position: center (default)
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- User-select: none (prevent drag/select)

### Shadow Variants
- **none**: no shadow
- **sm**: 0 1px 3px rgba(0, 0, 0, 0.1)
- **md**: 0 4px 12px rgba(0, 0, 0, 0.15) (default)
- **lg**: 0 10px 25px rgba(0, 0, 0, 0.2)
- **xl**: 0 20px 40px rgba(0, 0, 0, 0.25)

### Hover Effects
- **none**: No transform or shadow change
- **lift**: Box-shadow 0 15px 40px rgba(0, 0, 0, 0.2), transform translateY(-6px)
- **zoom**: Scale 1.05, box-shadow 0 15px 40px rgba(0, 0, 0, 0.2)
- **glow**: Box-shadow 0 0 20px rgba(37, 99, 235, 0.3), scale 1.02 (for colorful images)

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
