# Button Component

Beautiful, interactive button with elegant styling and responsive interactions. Supports multiple variants and sizes.

## Purpose
Interactive button component with configurable appearance, variants, and click handler. Used for calls-to-action, forms, and interactive elements throughout the site.

## Component Type
React functional component with event handling

## Props
- `label` (string, required): Button text label. Default: 'Click me'
- `onClick` (function, optional): Click event handler
- `variant` (string, optional): Button style variant ('primary'|'secondary'|'danger'|'ghost'). Default: 'primary'
- `size` (string, optional): Button size ('sm'|'md'|'lg'). Default: 'md'
- `disabled` (boolean, optional): Disable button. Default: false
- `fullWidth` (boolean, optional): Stretch to full width. Default: false
- `style` (object, optional): Additional inline styles to merge

## Design Specifications

### Sizing
- **sm**: padding 8px 12px, font-size 0.75rem, min-width 80px
- **md**: padding 12px 20px, font-size 0.875rem, min-width 100px
- **lg**: padding 16px 28px, font-size 1rem, min-width 120px

### Variants

#### Primary Button
- Background: linear gradient from #2563eb to #1e40af (modern gradient)
- Color: #ffffff (white)
- Border: none
- Border-radius: 12px (more modern rounded corners)
- Font-weight: 700 (bolder for better impact)
- Letter-spacing: 0.4px
- Cursor: pointer
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1) (smooth easing)
- Box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) (depth shadow)
- Hover: background linear gradient from #1e40af to #1e3a8a, box-shadow 0 8px 20px rgba(37, 99, 235, 0.4), transform translateY(-2px) lift
- Active: background linear gradient from #1e3a8a to #1e3a8a, box-shadow 0 2px 8px rgba(37, 99, 235, 0.2), transform translateY(0) pressed
- Focus: outline 3px solid rgba(37, 99, 235, 0.5), outline-offset 2px for keyboard
- Disabled: background #cbd5e1 (gray), cursor not-allowed, opacity 0.5 dimmed, box-shadow none

#### Secondary Button
- Background: linear gradient from #f1f5f9 to #e2e8f0 (subtle gradient)
- Color: #1e293b
- Border: 2px solid #cbd5e1 (bolder border)
- Border-radius: 12px (modern corners)
- Font-weight: 700 (bolder)
- Cursor: pointer
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06)
- Hover: background linear gradient from #e2e8f0 to #cbd5e1, box-shadow 0 6px 16px rgba(0, 0, 0, 0.1), transform translateY(-2px)
- Active: background linear gradient from #cbd5e1 to #cbd5e1, box-shadow 0 2px 4px rgba(0, 0, 0, 0.05), transform translateY(0)
- Focus: outline 3px solid rgba(37, 99, 235, 0.4), outline-offset 2px
- Disabled: background #f1f5f9, color #cbd5e1, cursor not-allowed, opacity 0.5

#### Danger Button
- Background: transparent
- Color: #dc2626 (deeper red for better contrast)
- Border: 2px solid #dc2626 (thicker, deeper red border)
- Border-radius: 12px (modern corners)
- Font-weight: 700 (bolder)
- Cursor: pointer
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15) (subtle danger shadow)
- Hover: background rgba(220, 38, 38, 0.1) (light danger bg), border-color #dc2626, box-shadow 0 6px 16px rgba(220, 38, 38, 0.25), transform translateY(-2px)
- Active: background rgba(220, 38, 38, 0.2), border-color #dc2626, box-shadow 0 2px 4px rgba(220, 38, 38, 0.15), transform translateY(0)
- Focus: outline 3px solid rgba(220, 38, 38, 0.4), outline-offset 2px
- Disabled: color #fecaca, border-color #fecaca, cursor not-allowed, opacity 0.5

#### Ghost Button
- Background: transparent
- Color: #64748b
- Border: none
- Border-radius: 8px
- Font-weight: 500
- Cursor: pointer
- Transition: all 150ms ease-in-out
- Hover: background #f1f5f9, color #1e293b
- Active: background #e2e8f0
- Focus: outline 2px solid #2563eb, outline-offset 2px
- Disabled: color #cbd5e1, cursor not-allowed

### States
- **Hover**: Lift effect with shadow, slight color shift
- **Active**: Pressed effect with no lift
- **Focus**: Clear outline for keyboard navigation
- **Disabled**: Reduced opacity, grayed out, no cursor

## Rendering Logic
1. Map variant prop to style object
2. Map size prop to padding and font-size
3. Apply fullWidth if true (width: 100%)
4. Merge all styles with props.style
5. Attach onClick handler safely
6. Render label as button text

## DOM Structure
```jsx
<button
  type="button"
  style={{
    ...variantStyles,
    ...sizeStyles,
    width: fullWidth ? '100%' : 'auto',
    ...props.style
  }}
  onClick={onClick}
  disabled={disabled}
  onMouseDown={handleMouseDown}
  onMouseUp={handleMouseUp}
>
  {label}
</button>
```

## Event Handling
- onClick: Call props.onClick if provided and not disabled
- Prevent default form submission (type="button")
- Handle disabled state completely (no click events fire)
- Support keyboard navigation (native button behavior)
- Visual feedback for all states

## Default Export
Export the Button component as default export.

## Implementation Notes
- Use native button element for accessibility
- Button is keyboard accessible by default
- Support focus states for keyboard navigation
- Handle onClick safely (check if function before calling)
- Use type="button" to prevent form submission
- Apply transitions for smooth state changes
- Ensure sufficient contrast ratio (WCAG AA)
- Support touch devices with appropriate hit targets (min 44px)
- Text should not be selectable (user-select: none)
- Components are tested and production-ready
