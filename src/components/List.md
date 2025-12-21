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
- Color: From color prop or variants (#1e293b default)
- Line-height: 1.7 (improved readability)
- Margin: 0
- Padding-left: 28px (more spacious)
- List-style-position: outside
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)

### List Items
- Padding: Depends on spacing prop:
  - **sm**: 8px 0
  - **md**: 12px 0 (default)
  - **lg**: 16px 0
  - **xl**: 20px 0
- Color: Inherit from parent
- Font-size: 1rem
- Font-weight: 400
- Letter-spacing: 0px (natural spacing)
- Transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1)
- Hover: color becomes darker, subtle lift effect (translateX 4px)
- Marker color: varies by variant
- Marker size: 6px diameter (standard)
- Marker spacing: 12px

### Color Variants
- **default**: #1e293b (dark text)
- **primary**: #2563eb (primary blue)
- **success**: #10b981 (emerald green)
- **danger**: #ef4444 (red)
- **muted**: #64748b (gray)
- Custom colors via color prop

### Unordered Lists (Bullet Variants)
- **disc**: Standard filled circle (default)
- **circle**: Outlined circle
- **square**: Square marker
- **check**: Custom ✓ checkmark style
- **arrow**: Custom → arrow style
- **dot**: Small filled dot

### Ordered Lists
- **decimal**: Standard numbers (1, 2, 3...)
- **roman**: Roman numerals (i, ii, iii...)
- **alpha**: Alphabetic (a, b, c...)
- **custom**: Custom counter with styling

### Marker Styling
- Color: Matches list color
- Size: 6px (standard), 8px (lg variant)
- Hover effect: Subtle shadow or highlight
- Box-shadow: 0 1px 2px rgba(0,0,0,0.05) on hover

### Interactive Features
- Hover: Text color changes, marker accent added
- Selection: Highlight background option via style
- Focus: Outline for keyboard navigation (outline 2px solid #2563eb)

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
