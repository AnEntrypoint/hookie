# Heading Component

Semantic heading component with beautiful typography and responsive scaling.

## Purpose
Renders semantic heading elements (h1-h6) with configurable text, styling, and alignment. Used for page titles, section headers, and visual hierarchy.

## Component Type
React functional component

## Props
- `level` (number, optional): Heading level (1-6). Default: 1
- `text` (string, required): Heading text content. Default: 'Heading'
- `color` (string, optional): CSS color value. Default: '#1e293b'
- `align` (string, optional): Text alignment ('left'|'center'|'right'). Default: 'left'
- `weight` (string, optional): Font weight ('normal'|'semibold'|'bold'). Default: 'bold'
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Typography by Level
- **H1**: font-size 3rem, font-weight 800, line-height 1.1, letter-spacing -0.8px, text-shadow subtle depth
- **H2**: font-size 2.25rem, font-weight 700, line-height 1.2, letter-spacing -0.5px
- **H3**: font-size 1.75rem, font-weight 700, line-height 1.3, letter-spacing -0.2px
- **H4**: font-size 1.375rem, font-weight 600, line-height 1.4, letter-spacing 0px
- **H5**: font-size 1.125rem, font-weight 600, line-height 1.5, letter-spacing 0.2px
- **H6**: font-size 1rem, font-weight 700, line-height 1.6, letter-spacing 0.3px

### Colors
- Default: #1e293b (dark text)
- Can be overridden with color prop
- Ensure sufficient contrast for readability

### Spacing
- Margin-bottom: 16px (default spacing below heading)
- Margin-top: 32px (if preceded by other content)

## Rendering Logic
1. Determine which heading element to use based on level prop (h1-h6)
2. Clamp level to valid range (1-6) if outside bounds
3. Create heading element with className 'heading' and `heading-${level}`
4. Apply inline styles:
   - Font-size based on level
   - Font-weight from weight prop
   - Color from props.color
   - Text-align from props.align
   - Merge with props.style
5. Render text as heading content

## DOM Structure
```jsx
<h{level}
  className={`heading heading-${level}`}
  style={{
    ...getLevelStyles(level),
    color: props.color || '#1e293b',
    textAlign: props.align || 'left',
    fontWeight: getWeight(props.weight),
    marginBottom: '16px',
    ...props.style
  }}
>
  {text}
</h{level}>
```

## Level Mapping
- level 1 → h1 (page title, main headline)
- level 2 → h2 (section header)
- level 3 → h3 (subsection header)
- level 4 → h4 (minor heading)
- level 5 → h5 (small heading)
- level 6 → h6 (smallest heading)
- Invalid levels clamp to 1-6 range

## Default Export
Export the Heading component as default export.

## Implementation Notes
- Use semantic HTML heading elements for SEO and accessibility
- Dynamically create correct heading element using React.createElement
- Sanitize text to prevent XSS (use textContent, not innerHTML)
- Handle empty text gracefully (render empty heading)
- Preserve heading hierarchy for accessibility
- Support responsive font sizes through style prop
- Ensure proper contrast ratio for readability
- Use appropriate spacing for visual rhythm
