# List Component

## Purpose
Renders ordered or unordered lists with configurable items. Used for displaying bullet points or numbered lists.

## Component Type
React functional component

## Props
- `type` (string, optional): List type ('ul' for unordered, 'ol' for ordered). Default: 'ul'
- `items` (array, required): Array of list items (strings). Default: ['Item 1', 'Item 2', 'Item 3']
- `color` (string, optional): CSS color value for text. Default: '#000000'
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Determine which list element to use based on type ('ul' or 'ol')
2. Create list container with className 'list'
3. Apply inline styles:
   - color from props.color
   - Merge with props.style if provided
4. Map over items array and create li elements for each item
5. Render list with all items

## DOM Structure (Unordered)
```
<ul class="list" style="color: #000000; ...">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

## DOM Structure (Ordered)
```
<ol class="list" style="color: #000000; ...">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>
```

## Default Export
Export the List component as default export.

## Implementation Notes
- Use ul element for unordered lists (bullets)
- Use ol element for ordered lists (numbers)
- Dynamically create element using React.createElement
- Handle empty items array gracefully (render empty list)
- Each li should have unique key (use index)
- Support nested lists through style prop (optional)
- Text should be rendered as plain text (no HTML)
- List style type can be customized via style prop
- Preserve semantic HTML for accessibility
