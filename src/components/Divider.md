# Divider Component

## Purpose
Horizontal separator component used to visually divide content sections. Renders as a styled line.

## Component Type
React functional component

## Props
- `color` (string, optional): CSS color value for the divider. Default: '#e0e0e0'
- `height` (string, optional): CSS height value for divider thickness. Default: '1px'
- `margin` (string, optional): CSS margin value for spacing. Default: '16px 0'
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Create a div element with className 'divider'
2. Apply inline styles:
   - backgroundColor from props.color
   - height from props.height
   - margin from props.margin
   - border: 'none'
   - width: '100%'
   - Merge with props.style if provided
3. Render empty div (self-closing)

## DOM Structure
```
<div
  class="divider"
  style="background-color: #e0e0e0; height: 1px; margin: 16px 0; border: none; width: 100%; ..."
/>
```

## Alternative Implementation
Could also use hr element instead of div:
```
<hr
  class="divider"
  style="background-color: #e0e0e0; height: 1px; margin: 16px 0; border: none; width: 100%; ..."
/>
```

## Default Export
Export the Divider component as default export.

## Implementation Notes
- Use div (or hr) for simple horizontal line
- No content inside divider (self-closing)
- Full width by default
- Vertical margin provides spacing from surrounding content
- Border set to none to avoid default hr borders
- Support custom colors for theming
- Background color creates the visible line
- Height determines thickness of the line
