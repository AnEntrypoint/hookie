# Container Component

Responsive content wrapper that constrains width and centers content with elegant spacing.

## Purpose
Simple wrapper component that constrains content to a maximum width and centers it. Used for creating responsive page layouts and maintaining visual hierarchy.

## Component Type
React functional component

## Props
- `maxWidth` (string, optional): CSS max-width value. Default: '1200px'
- `padding` (string, optional): Padding amount ('none'|'sm'|'md'|'lg'|'xl'). Default: 'md'
- `children` (ReactNode, optional): Child components to render inside container
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Max Widths
- Small: 640px
- Medium: 768px
- Large: 1024px
- XL: 1200px
- 2XL: 1400px

### Padding Variants (Horizontal × Vertical)
- **none**: 0px × 0px
- **sm**: 16px × 12px
- **md**: 24px × 16px
- **lg**: 32px × 20px
- **xl**: 48px × 28px
- **2xl**: 64px × 32px

### Container Styles
- Display: block
- Width: 100%
- Max-width: from props (default 1200px)
- Margin: 0 auto (centered horizontally)
- Padding: Respects padding prop
- Box-sizing: border-box
- Transition: padding 200ms cubic-bezier(0.4, 0, 0.2, 1)

### Responsive Breakpoints
- **Mobile** (< 640px): Full-width with padding sm
- **Tablet** (640px - 1024px): Full-width with padding md
- **Desktop** (1024px+): Constrained width with padding lg+

### Background Options
- Default: transparent
- Can accept custom background color via style prop
- Supports gradient backgrounds

## Rendering Logic
1. Create div element with className 'container'
2. Apply max-width constraint from props
3. Apply responsive padding based on padding prop
4. Center with margin: 0 auto
5. Set box-sizing: border-box
6. Render children inside

## DOM Structure
```jsx
<div
  style={{
    display: 'block',
    width: '100%',
    maxWidth: props.maxWidth || '1200px',
    margin: '0 auto',
    padding: getPadding(props.padding),
    boxSizing: 'border-box',
    ...props.style
  }}
>
  {children}
</div>
```

## Padding Helper
```javascript
const getPadding = (paddingProp) => {
  const paddings = {
    none: '0',
    sm: '0 12px',
    md: '0 24px',
    lg: '0 32px',
    xl: '0 48px'
  };
  return paddings[paddingProp] || paddings.md;
};
```

## Default Export
Export the Container component as default export.

## Implementation Notes
- Container centers content horizontally with margin auto
- Horizontal padding prevents content from touching viewport edges on mobile
- maxWidth prevents content from being too wide on large screens
- Use box-sizing: border-box to include padding in width calculation
- Support nested containers
- Handle empty children gracefully (render empty div)
- Full-width on all screen sizes with maxWidth constraint
- Responsive padding adjusts based on viewport
- Preserve CSS cascade for children styling

<!-- Regenerated -->
