# List Component

Beautifully styled list component for displaying organized content with smooth interactions.

## Purpose
Renders ordered or unordered lists with modern styling, configurable spacing, and accessibility support. Used for displaying bullet points, numbered lists, and organized content.

## Component Type
React functional component with hooks

## Props
- `type` (string, optional): List type ('ul' for unordered, 'ol' for ordered). Default: 'ul'
- `items` (array, required): Array of list items (strings). Default: ['Item 1', 'Item 2', 'Item 3']
- `color` (string, optional): CSS color value for text. Default: '#1e293b'
- `spacing` (string, optional): Spacing between items ('sm'|'md'|'lg'). Default: 'md'
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Container
- Font-family: System font from index.md
- Color: props.color or #1e293b
- Line-height: 1.9 (improved readability)
- Margin: 0
- Padding-left: 28px (more spacious)
- List-style-position: outside
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)

### List Items
- Padding: Depends on spacing prop:
  - **sm**: 6px 0
  - **md**: 12px 0
  - **lg**: 16px 0
- Color: Inherit from parent
- Font-size: 1rem
- Font-weight: 400
- Letter-spacing: 0.2px (improved text clarity)
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Hover: color becomes #1e40af (darker blue), scale 1.01 transform
- Marker color: #2563eb (primary blue)
- Marker size: 7px diameter (more prominent)
- Marker shadow: subtle drop shadow for depth

### Unordered Lists
- Bullet style: disc
- Marker size: 6px
- Marker spacing: 12px

### Ordered Lists
- Number style: decimal
- Counter: auto-incrementing
- Marker spacing: 12px

### Dark Mode Support
- Color: Automatically adjust for dark backgrounds
- If background is dark, use light text colors

## Rendering Logic
1. Determine which list element to use based on type prop ('ul' or 'ol')
2. Create list container with className 'list'
3. Apply inline styles:
   - color from props.color
   - Merge with props.style if provided
   - Apply spacing based on spacing prop
4. Map over items array and create li elements
5. Each li has unique key (use index)
6. Render list with all items

## DOM Structure (Unordered)
```jsx
<ul
  style={{
    color: props.color || '#1e293b',
    fontFamily: 'inherit',
    lineHeight: 1.8,
    margin: 0,
    paddingLeft: 24,
    listStylePosition: 'outside',
    ...props.style
  }}
>
  {items.map((item, index) => (
    <li
      key={index}
      style={{
        padding: getSpacing(props.spacing),
        cursor: 'default',
        transition: 'color 150ms ease-in-out'
      }}
    >
      {item}
    </li>
  ))}
</ul>
```

## DOM Structure (Ordered)
```jsx
<ol
  style={{
    color: props.color || '#1e293b',
    fontFamily: 'inherit',
    lineHeight: 1.8,
    margin: 0,
    paddingLeft: 24,
    listStylePosition: 'outside',
    ...props.style
  }}
>
  {items.map((item, index) => (
    <li
      key={index}
      style={{
        padding: getSpacing(props.spacing),
        cursor: 'default',
        transition: 'color 150ms ease-in-out'
      }}
    >
      {item}
    </li>
  ))}
</ol>
```

## Spacing Helper
```javascript
const getSpacing = (spacingProp) => {
  const spacing = {
    sm: '4px 0',
    md: '8px 0',
    lg: '12px 0'
  };
  return spacing[spacingProp] || spacing.md;
};
```

## Default Export
Export the List component as default export.

## Implementation Notes
- Use ul element for unordered lists (bullets)
- Use ol element for ordered lists (numbers)
- Dynamically create element using React.createElement
- Handle empty items array gracefully (render empty list)
- Each li should have unique key (use index)
- Support nested lists through style prop
- Text should be rendered as plain text (no HTML)
- List style type can be customized via style prop
- Preserve semantic HTML for accessibility
- Ensure proper contrast ratio for readability
- Support keyboard navigation
- Use custom marker colors for visual hierarchy
