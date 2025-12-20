# Text Component

## Purpose
Displays text content with configurable typography styles. Core component for displaying paragraphs and text blocks.

## Component Type
React functional component

## Props
- `content` (string, required): Text content to display. Default: 'Enter text'
- `fontSize` (string, optional): CSS font-size value. Default: '16px'
- `color` (string, optional): CSS color value. Default: '#000000'
- `fontWeight` (string, optional): CSS font-weight value. Default: 'normal'
- `align` (string, optional): CSS text-align value ('left', 'center', 'right', 'justify'). Default: 'left'
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Create a p (paragraph) element with className 'text'
2. Apply inline styles:
   - fontSize from props.fontSize
   - color from props.color
   - fontWeight from props.fontWeight
   - textAlign from props.align
   - Merge with props.style if provided
3. Render content as text inside the paragraph

## DOM Structure
```
<p class="text" style="...">
  {content}
</p>
```

## Default Export
Export the Text component as default export.

## Implementation Notes
- Use p element for semantic HTML
- Sanitize content to prevent XSS (use textContent, not innerHTML)
- Handle empty content gracefully (render empty paragraph)
- Support multiline text with proper line breaks
- Allow content to be rendered as plain text only (no HTML)
- Styles should cascade properly with parent containers
