# Grid Component

## Purpose
CSS Grid layout container that arranges children in a responsive grid pattern. Used for creating multi-column layouts.

## Component Type
React functional component

## Props
- `columns` (number, optional): Number of grid columns. Default: 2
- `gap` (string, optional): CSS gap value for spacing between grid items. Default: '16px'
- `children` (ReactNode, optional): Child components to render as grid items
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Create a div container with className 'grid'
2. Apply inline styles:
   - display: 'grid'
   - gridTemplateColumns: `repeat(${columns}, 1fr)`
   - gap from props.gap
   - Merge with props.style if provided
3. Render children inside the grid container
4. Each child automatically becomes a grid item

## DOM Structure
```
<div class="grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; ...">
  {children}
</div>
```

## Default Export
Export the Grid component as default export.

## Implementation Notes
- Use CSS Grid for layout (not flexbox)
- Support responsive columns through style prop override
- Handle empty children gracefully (render empty grid)
- Grid items should fill available space equally
- Support nested grids
- Auto-flow behavior: row (default)
- Each child should span 1 column by default
- Consider min-width for columns to prevent overflow
