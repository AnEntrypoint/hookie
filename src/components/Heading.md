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
- **H1**: font-size 3.5rem, font-weight 800, line-height 1.1, letter-spacing -1px, text-shadow 0 2px 4px rgba(0,0,0,0.1), margin-bottom 32px, margin-top 0
- **H2**: font-size 2.5rem, font-weight 800, line-height 1.2, letter-spacing -0.5px, margin-bottom 24px, margin-top 0
- **H3**: font-size 1.875rem, font-weight 700, line-height 1.3, letter-spacing -0.3px, margin-bottom 20px, margin-top 0
- **H4**: font-size 1.5rem, font-weight 700, line-height 1.4, letter-spacing -0.1px, margin-bottom 16px, margin-top 0
- **H5**: font-size 1.25rem, font-weight 600, line-height 1.5, letter-spacing 0px, margin-bottom 12px, margin-top 0
- **H6**: font-size 1.125rem, font-weight 700, line-height 1.6, letter-spacing 0.3px, margin-bottom 12px, margin-top 0

### Colors (with Variants)
- **Default**: #1e293b (dark text)
- **Primary**: #2563eb (accent color)
- **Success**: #10b981 (success/positive)
- **Danger**: #ef4444 (error/danger)
- **Muted**: #64748b (secondary text)
- Custom colors via color prop

### Gradients (Bonus)
- **Blue Gradient**: from #2563eb to #1e40af
- **Green Gradient**: from #10b981 to #059669
- **Purple Gradient**: from #8b5cf6 to #7c3aed

### Spacing
- Margin-bottom: Varies by level (12-24px)
- Margin-top: 0 (parent container manages top spacing)
- Word-break: break-word (handle long words)

### Responsive Behavior
- Font sizes scale down on mobile screens
- Letter-spacing adjusts for readability
- Line-height remains consistent across breakpoints

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
