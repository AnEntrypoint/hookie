# Grid Component

Responsive CSS Grid layout for arranging content in columns with elegant spacing and responsive behavior.

## Purpose
CSS Grid layout container that arranges children in a responsive grid pattern. Used for creating multi-column layouts with equal-width items and configurable gaps.

## Component Type
React functional component

## Props
- `columns` (number, optional): Number of grid columns. Default: 2
- `gap` (string, optional): Gap preset ('sm'|'md'|'lg') or CSS value. Default: 'md'
- `minItemWidth` (string, optional): Minimum width for auto-responsive grids. Default: '250px'
- `autoFit` (boolean, optional): Use auto-fit for responsive columns. Default: false
- `children` (ReactNode, optional): Child components as grid items
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Gap Presets
- **sm**: 12px (compact spacing)
- **md**: 20px (default spacing)
- **lg**: 32px (generous spacing)

### Grid Templates
- Standard: `repeat(columns, 1fr)`
- Auto-fit: `repeat(auto-fit, minmax(minItemWidth, 1fr))`
- Auto-fill: `repeat(auto-fill, minmax(minItemWidth, 1fr))`

### Default Behavior
- Display: grid
- Grid-auto-flow: row (top-to-bottom)
- Each child spans 1 column by default
- Items stretch to fill available space

## Rendering Logic
1. Create div container with className 'grid'
2. Apply inline styles:
   - display: 'grid'
   - gridTemplateColumns: Based on columns or autoFit prop
   - gap: from gap prop
   - Merge with props.style
3. Render children inside grid container
4. Each child automatically becomes grid item

## DOM Structure
```jsx
<div
  className="grid"
  style={{
    display: 'grid',
    gridTemplateColumns: props.autoFit
      ? `repeat(auto-fit, minmax(${props.minItemWidth || '250px'}, 1fr))`
      : `repeat(${props.columns || 2}, 1fr)`,
    gap: getGapValue(props.gap),
    ...props.style
  }}
>
  {children}
</div>
```

## Gap Helper
```javascript
const getGapValue = (gapProp) => {
  const gaps = {
    sm: '12px',
    md: '20px',
    lg: '32px'
  };
  return gaps[gapProp] || gapProp || gaps.md;
};
```

## Default Export
Export the Grid component as default export.

## Implementation Notes
- Use CSS Grid (not flexbox) for proper column layout
- Support responsive columns through autoFit option
- Handle empty children gracefully
- Grid items fill available space equally
- Support nested grids
- Auto-flow row direction (default)
- Each child spans 1 column unless overridden
- Auto-fit creates responsive columns automatically
