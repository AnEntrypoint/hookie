# Text Component

Elegant typography component for body text, paragraphs, and content blocks with beautiful default styling.

## Purpose
Displays text content with configurable typography styles. Core component for displaying paragraphs, body text, and descriptive content throughout the site.

## Component Type
React functional component

## Props
- `content` (string, required): Text content to display. Default: 'Enter text'
- `size` (string, optional): Text size ('sm'|'base'|'lg'|'xl'). Default: 'base'
- `color` (string, optional): CSS color value. Default: '#1e293b'
- `weight` (string, optional): Font weight ('normal'|'semibold'|'bold'). Default: 'normal'
- `align` (string, optional): Text alignment ('left'|'center'|'right'|'justify'). Default: 'left'
- `lineHeight` (string, optional): Line height multiplier. Default: '1.6'
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Font Sizes
- **sm**: 0.875rem (14px), line-height 1.6, compact sizing
- **base**: 1rem (16px), line-height 1.7, default body text
- **lg**: 1.125rem (18px), line-height 1.8, larger text blocks
- **xl**: 1.25rem (20px), line-height 1.9, extra large display text

### Font Weights
- Normal: 400
- Semibold: 600
- Bold: 700

### Colors
- Default: #1e293b (dark text)
- Muted: #64748b (lighter gray for secondary text)
- Subtle: #94a3b8 (very light gray for hints)
- Accent: #2563eb (primary blue for highlights)

### Spacing
- Margin-bottom: 16px (natural spacing between paragraphs)
- Margin-top: 0
- Letter-spacing: 0.3px (subtle letter spacing for better readability)
- Word-spacing: 0.05em (improved word spacing)

## Rendering Logic
1. Create p (paragraph) element with className 'text'
2. Apply inline styles:
   - Font-size from size prop
   - Color from props.color
   - Font-weight from weight prop
   - Text-align from props.align
   - Line-height from lineHeight prop
   - Merge with props.style
3. Render content as text

## DOM Structure
```jsx
<p
  style={{
    fontSize: getSizeValue(props.size),
    color: props.color || '#1e293b',
    fontWeight: getWeight(props.weight),
    textAlign: props.align || 'left',
    lineHeight: props.lineHeight || '1.6',
    marginBottom: '16px',
    margin: 0,
    padding: 0,
    ...props.style
  }}
>
  {content}
</p>
```

## Default Export
Export the Text component as default export.

## Implementation Notes
- Use p element for semantic HTML
- Sanitize content to prevent XSS (use textContent, not innerHTML)
- Handle empty content gracefully
- Support multiline text with proper line breaks
- Render as plain text only (no HTML)
- Styles cascade properly with parent containers
- Ensure readable line-height for body text (minimum 1.5)
- Proper contrast ratio for accessibility
