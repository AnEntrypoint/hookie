# Divider Component

Elegant horizontal separator for visually dividing content sections with subtle styling.

## Purpose
Horizontal separator component used to visually divide content sections. Renders as a styled line with configurable appearance and spacing.

## Component Type
React functional component

## Props
- `color` (string, optional): Line color. Default: '#e2e8f0' (light border)
- `thickness` (string, optional): Line thickness ('thin'|'normal'|'thick'). Default: 'normal'
- `margin` (string, optional): Margin preset ('sm'|'md'|'lg'). Default: 'md'
- `fullWidth` (boolean, optional): Extend to full container width. Default: true
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Thickness Options
- **thin**: 1px
- **normal**: 1px (standard)
- **thick**: 2px

### Margin Presets
- **sm**: 12px 0
- **md**: 24px 0 (default)
- **lg**: 32px 0

### Colors
- Default: #e2e8f0 (light border gray)
- Dark: #cbd5e1 (medium gray)
- Accent: #2563eb (primary blue)
- Success: #10b981 (emerald green)

### Container
- Display: block
- Full width by default
- No border (background color only)
- Box-sizing: border-box

## Rendering Logic
1. Create div element with className 'divider'
2. Apply inline styles:
   - background-color from props.color
   - height from thickness prop
   - margin from margin prop
   - width: 100%
   - border: none
   - Merge with props.style
3. Render empty self-closing div

## DOM Structure
```jsx
<div
  className="divider"
  style={{
    display: 'block',
    width: props.fullWidth ? '100%' : 'auto',
    height: getThickness(props.thickness),
    backgroundColor: props.color || '#e2e8f0',
    margin: getMargin(props.margin),
    border: 'none',
    boxSizing: 'border-box',
    ...props.style
  }}
/>
```

## Thickness Helper
```javascript
const getThickness = (thicknessProp) => {
  const thicknesses = {
    thin: '1px',
    normal: '1px',
    thick: '2px'
  };
  return thicknesses[thicknessProp] || thicknesses.normal;
};
```

## Margin Helper
```javascript
const getMargin = (marginProp) => {
  const margins = {
    sm: '12px 0',
    md: '24px 0',
    lg: '32px 0'
  };
  return margins[marginProp] || margins.md;
};
```

## Default Export
Export the Divider component as default export.

## Implementation Notes
- Use div for simple horizontal line
- No content inside divider
- Full width by default
- Vertical margin provides spacing from content
- Background color creates the visible line
- Height determines line thickness
- Support custom colors for theming
- Subtle default color for minimal visual impact
