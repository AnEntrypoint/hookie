# Heading Component

## Purpose
Renders semantic heading elements (h1-h6) with configurable text and styling. Used for page and section titles.

## Component Type
React functional component

## Props
- `level` (number, optional): Heading level (1-6). Default: 1
- `text` (string, required): Heading text content. Default: 'Heading'
- `color` (string, optional): CSS color value. Default: '#000000'
- `align` (string, optional): CSS text-align value ('left', 'center', 'right'). Default: 'left'
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Determine which heading element to use based on level prop (h1, h2, h3, h4, h5, or h6)
2. Clamp level to valid range (1-6) if outside bounds
3. Create heading element with className 'heading' and className `heading-${level}`
4. Apply inline styles:
   - color from props.color
   - textAlign from props.align
   - Merge with props.style if provided
5. Render text as heading content

## DOM Structure
```
<h{level} class="heading heading-{level}" style="color: #000000; text-align: left; ...">
  {text}
</h{level}>
```

## Level Mapping
- level 1 → h1
- level 2 → h2
- level 3 → h3
- level 4 → h4
- level 5 → h5
- level 6 → h6
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
- Default browser heading styles apply (can be overridden)
