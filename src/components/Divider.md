# Divider Component

Elegant horizontal separator for visually dividing content sections with subtle styling.

## Purpose
Horizontal separator component used to visually divide content sections. Renders as a styled line with configurable appearance and spacing.

## Component Type
React functional component

## Props
- `color` (string, optional): Line color variant or custom color. Default: 'default'
- `variant` (string, optional): Divider style ('solid'|'dashed'|'dotted'|'gradient'). Default: 'solid'
- `thickness` (string, optional): Line thickness ('thin'|'normal'|'thick'|'xl'). Default: 'normal'
- `margin` (string, optional): Margin preset ('sm'|'md'|'lg'|'xl'). Default: 'md'
- `fullWidth` (boolean, optional): Extend to full container width. Default: true
- `orientation` (string, optional): Direction ('horizontal'|'vertical'). Default: 'horizontal'
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Thickness Options
- **thin**: 0.5px (delicate, subtle)
- **normal**: 1px (standard, balanced)
- **thick**: 2px (bold, prominent)
- **xl**: 3px (heavy, dramatic)

### Margin Presets (Vertical/Horizontal)
- **sm**: 16px 0 (horizontal), 0 12px (vertical)
- **md**: 28px 0 (horizontal), 0 20px (vertical) - default
- **lg**: 40px 0 (horizontal), 0 32px (vertical)
- **xl**: 56px 0 (horizontal), 0 48px (vertical)

### Color Variants
- **default**: #e2e8f0 (light gray)
- **dark**: #cbd5e1 (medium gray)
- **primary**: #2563eb (primary blue)
- **success**: #10b981 (emerald green)
- **danger**: #ef4444 (red)
- **muted**: #94a3b8 (light gray muted)
- Custom colors via direct hex/rgb values

### Divider Variants
- **solid**: Continuous solid line
- **dashed**: Dashed pattern (8px dash, 6px gap)
- **dotted**: Dotted pattern (2px dot, 4px gap)
- **gradient**: Gradient background from color to transparent

### Gradient Backgrounds
- **blue-gradient**: From #2563eb to transparent
- **green-gradient**: From #10b981 to transparent
- **purple-gradient**: From #8b5cf6 to transparent
- **rainbow**: Multi-color gradient effect

### Styling
- Gradient and dashed support for modern look
- Transition: background 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Box-shadow: subtle shadow option for depth (0 1px 2px rgba(0,0,0,0.05))
- Border-radius: 1px (minimal rounding for soft edges)
- Opacity: 1 (solid), 0.6 (subtle)

### Container
- Display: block (horizontal) / inline-block (vertical)
- Full width by default (horizontal)
- Min height: thickness value
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
