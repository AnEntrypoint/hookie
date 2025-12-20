# Section Component

## Purpose
Container component that wraps children with configurable padding and background. Used to create distinct sections on a page.

## Component Type
React functional component

## Props
- `title` (string, optional): Section title to display above children. Default: empty string
- `padding` (string, optional): CSS padding value. Default: '20px'
- `background` (string, optional): CSS background value (color, gradient, image). Default: 'transparent'
- `children` (ReactNode, optional): Child components to render inside the section
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Create a div container with className 'section'
2. Apply inline styles:
   - padding from props.padding
   - background from props.background
   - Merge with props.style if provided
3. If title is provided and not empty:
   - Render an h2 element with className 'section-title' containing the title
4. Render children inside the container

## DOM Structure
```
<div class="section" style="...">
  {title && <h2 class="section-title">{title}</h2>}
  {children}
</div>
```

## Default Export
Export the Section component as default export.

## Implementation Notes
- Use React.createElement or JSX syntax
- Merge styles properly using object spread
- Handle missing children gracefully (render empty div)
- Title should have margin-bottom if children exist
- Section should be full-width by default
- Support responsive behavior through style prop
