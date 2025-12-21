# Link Component

Beautiful hyperlink component with elegant styling, hover effects, and accessibility support.

## Purpose
Hyperlink component for navigation. Renders as an anchor element with configurable styling, hover effects, and proper accessibility.

## Component Type
React functional component

## Props
- `href` (string, required): URL or anchor link. Default: '#'
- `text` (string, required): Link text to display. Default: 'Link'
- `variant` (string, optional): Link style variant ('default'|'underline'|'button'|'pill'). Default: 'default'
- `color` (string, optional): Link color variant ('primary'|'success'|'danger'|'muted'). Default: 'primary'
- `customColor` (string, optional): Custom hex color, overrides color variant
- `size` (string, optional): Text size ('sm'|'md'|'lg'). Default: 'md'
- `newTab` (boolean, optional): Open in new tab. Default: false
- `underline` (boolean, optional): Show underline by default. Default: false
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Color Variants
- **Primary**: #2563eb (blue) → hover #1e40af → active #1e3a8a
- **Success**: #10b981 (green) → hover #059669 → active #047857
- **Danger**: #ef4444 (red) → hover #dc2626 → active #991b1b
- **Muted**: #64748b (gray) → hover #475569 → active #1e293b
- Custom colors via customColor prop

### Link Variants

#### Default Variant
- Color: From color prop
- Text-decoration: none
- Cursor: pointer
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Font-weight: 600
- Position: relative
- Border-bottom: 2px solid transparent
- Hover: Color darkened, border-bottom solid, transform translateX(2px)
- Active: Color darkest, border-bottom solid
- Focus: outline 3px solid with offset 2px, box-shadow glow

#### Underline Variant
- Color: From color prop
- Text-decoration: underline (always visible)
- Font-weight: 600
- Cursor: pointer
- Transition: color 150ms ease-in-out
- Hover: Color darkened, brightness(1.1)
- Focus: Outline with offset

#### Button Variant
- Background: From color prop (solid color)
- Color: white
- Padding: 8px 16px (sm), 10px 20px (md), 12px 24px (lg)
- Border-radius: 8px
- Font-weight: 600
- Cursor: pointer
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Box-shadow: 0 2px 8px rgba from color
- Hover: Darker shade, lift effect (translateY -2px), enhanced shadow
- Active: Darker, pressed (translateY 0), reduced shadow

#### Pill Variant
- Background: From color prop with opacity 0.1
- Color: From color prop
- Padding: 8px 16px (sm), 10px 20px (md), 12px 24px (lg)
- Border-radius: 9999px (full)
- Border: 2px solid from color prop
- Font-weight: 600
- Cursor: pointer
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Hover: Solid background, white text, transform scale(1.05)
- Active: Darker background

### Text Size Options
- **sm**: 0.875rem, height 32px (for buttons)
- **md**: 1rem, height 40px (default)
- **lg**: 1.125rem, height 48px (for buttons)

### External Links
- rel: "noopener noreferrer"
- target: "_blank" (if newTab prop is true)
- Indicator: Small external icon appended

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
