# Link Component

## Purpose
Hyperlink component for navigation. Renders as an anchor element with configurable styling.

## Component Type
React functional component

## Props
- `href` (string, required): URL or anchor link. Default: '#'
- `text` (string, required): Link text to display. Default: 'Link'
- `color` (string, optional): CSS color value. Default: '#007bff'
- `underline` (boolean, optional): Whether to show underline. Default: true
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Create an a (anchor) element with className 'link'
2. Set href attribute from props.href
3. Apply inline styles:
   - color from props.color
   - textDecoration: props.underline ? 'underline' : 'none'
   - Merge with props.style if provided
4. Render text as link content

## DOM Structure
```
<a
  class="link"
  href="..."
  style="color: #007bff; text-decoration: underline; ..."
>
  {text}
</a>
```

## Default Export
Export the Link component as default export.

## Implementation Notes
- Use native anchor element for proper link behavior
- Support both external URLs and internal hash links
- Underline controlled by textDecoration style
- No target="_blank" by default (can be added via style/props if needed)
- Handle empty href gracefully (defaults to #)
- Support keyboard navigation (native behavior)
- Accessible by default with proper href
- Consider adding rel="noopener noreferrer" for external links (optional)
- Text should be visible and readable
