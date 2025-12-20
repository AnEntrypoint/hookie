# Link Component

Beautiful hyperlink component with elegant styling, hover effects, and accessibility support.

## Purpose
Hyperlink component for navigation. Renders as an anchor element with configurable styling, hover effects, and proper accessibility.

## Component Type
React functional component

## Props
- `href` (string, required): URL or anchor link. Default: '#'
- `text` (string, required): Link text to display. Default: 'Link'
- `color` (string, optional): Link color. Default: '#2563eb' (primary blue)
- `underline` (boolean, optional): Show underline by default. Default: false
- `newTab` (boolean, optional): Open in new tab. Default: false
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Link Styling
- Color: #2563eb (primary blue)
- Text-decoration: none (underline on hover)
- Cursor: pointer
- Transition: all 150ms ease-in-out
- Font-weight: 500

### Hover State
- Text-decoration: underline
- Color: #1e40af (darker blue)
- Slight opacity increase
- Smooth transition

### Active State
- Color: #1e3a8a (dark blue)
- Text-decoration: underline

### Focus State
- Outline: 2px solid #dbeafe
- Outline-offset: 2px
- Outline-style: solid

### External Links
- rel: "noopener noreferrer"
- target: "_blank" (if newTab prop is true)
- Visual indicator (optional icon) for external links

## Rendering Logic
1. Create an a (anchor) element with className 'link'
2. Set href attribute from props.href
3. Add rel and target attributes if needed
4. Apply inline styles:
   - Color from props.color
   - Text-decoration based on underline prop
   - Merge with props.style
5. Render text as link content

## DOM Structure
```jsx
<a
  href={props.href || '#'}
  className="link"
  target={props.newTab ? '_blank' : undefined}
  rel={props.newTab ? 'noopener noreferrer' : undefined}
  style={{
    color: props.color || '#2563eb',
    textDecoration: props.underline ? 'underline' : 'none',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 150ms ease-in-out',
    '&:hover': {
      textDecoration: 'underline',
      color: '#1e40af'
    },
    ...props.style
  }}
>
  {text}
</a>
```

## Default Export
Export the Link component as default export.

## Implementation Notes
- Use native anchor element for proper link semantics
- Support both external URLs and internal hash links
- Underline appears on hover for visual feedback
- Include rel="noopener noreferrer" for security with target="_blank"
- Handle empty href gracefully (defaults to #)
- Support keyboard navigation (native behavior)
- Accessible by default with proper href
- Visible focus indicator for keyboard users
- Proper contrast ratio for readability
