# Section Component

Flexible container component that wraps content with elegant spacing, backgrounds, and optional section titles.

## Purpose
Container component that wraps children with configurable padding, background, and optional title. Used to create distinct visual sections on a page with clear visual hierarchy.

## Component Type
React functional component

## Props
- `title` (string, optional): Section title to display above children
- `padding` (string, optional): Padding preset ('sm'|'md'|'lg'|'xl'). Default: 'md'
- `background` (string, optional): Background color or gradient. Default: 'transparent'
- `fullWidth` (boolean, optional): Ignore max-width constraint. Default: false
- `children` (ReactNode, optional): Child components to render inside
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Padding Presets
- **sm**: 16px
- **md**: 32px
- **lg**: 48px
- **xl**: 64px

### Background Options
- transparent (default)
- #f8fafc (light gray)
- #ffffff (white)
- Linear gradients
- Custom colors

### Section Title
- Font-size: 1.5rem
- Font-weight: 700
- Color: #1e293b
- Margin-bottom: 24px
- Letter-spacing: -0.5px

### Container
- Full-width by default
- Max-width: 1200px (unless fullWidth is true)
- Margin: 0 auto
- Transitions: background-color 200ms ease-in-out

## Rendering Logic
1. Create div container with className 'section'
2. Apply inline styles:
   - Padding from padding prop
   - Background from background prop
   - Full-width or constrained based on fullWidth prop
   - Merge with props.style
3. If title is provided and not empty:
   - Render h2 element with className 'section-title' containing title
   - Add margin-bottom: 24px
4. Render children inside the container

## DOM Structure
```jsx
<div
  className="section"
  style={{
    width: props.fullWidth ? '100%' : 'auto',
    maxWidth: props.fullWidth ? '100%' : '1200px',
    margin: props.fullWidth ? '0' : '0 auto',
    padding: getPadding(props.padding),
    backgroundColor: props.background || 'transparent',
    transition: 'background-color 200ms ease-in-out',
    ...props.style
  }}
>
  {props.title && (
    <h2 style={{
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#1e293b',
      marginBottom: '24px',
      margin: '0 0 24px 0'
    }}>
      {props.title}
    </h2>
  )}
  {props.children}
</div>
```

## Padding Helper
```javascript
const getPadding = (paddingProp) => {
  const paddings = {
    sm: '16px',
    md: '32px',
    lg: '48px',
    xl: '64px'
  };
  return paddings[paddingProp] || paddings.md;
};
```

## Default Export
Export the Section component as default export.

## Implementation Notes
- Use React.createElement or JSX syntax
- Merge styles properly using object spread
- Handle missing children gracefully
- Title has proper margin-bottom spacing
- Section is full-width by default with max-width constraint
- Support responsive padding through padding prop
- Support custom backgrounds for theming
