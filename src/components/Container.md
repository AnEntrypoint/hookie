# Container Component

## Purpose
Simple wrapper component that constrains content to a maximum width and centers it. Used for creating responsive page layouts.

## Component Type
React functional component

## Props
- `maxWidth` (string, optional): CSS max-width value. Default: '1200px'
- `children` (ReactNode, optional): Child components to render inside container
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Create a div element with className 'container'
2. Apply inline styles:
   - maxWidth from props.maxWidth
   - margin: '0 auto' (center the container)
   - padding: '0 16px' (horizontal padding)
   - Merge with props.style if provided
3. Render children inside the container

## DOM Structure
```
<div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 16px; ...">
  {children}
</div>
```

## Default Export
Export the Container component as default export.

## Implementation Notes
- Container centers content horizontally with margin auto
- Horizontal padding prevents content from touching viewport edges on mobile
- maxWidth prevents content from being too wide on large screens
- Support nested containers (though not recommended)
- Handle empty children gracefully (render empty div)
- Full-width on small screens (up to maxWidth)
- Responsive behavior through maxWidth constraint
