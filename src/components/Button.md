# Button Component

## Purpose
Interactive button component with configurable appearance and click handler. Used for calls-to-action and interactive elements.

## Component Type
React functional component

## Props
- `label` (string, required): Button text label. Default: 'Click me'
- `onClick` (function, optional): Click event handler. Default: no-op function
- `background` (string, optional): CSS background value. Default: '#007bff'
- `color` (string, optional): CSS text color value. Default: '#ffffff'
- `padding` (string, optional): CSS padding value. Default: '10px 20px'
- `borderRadius` (string, optional): CSS border-radius value. Default: '4px'
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Create a button element with className 'button'
2. Apply inline styles:
   - background from props.background
   - color from props.color
   - padding from props.padding
   - borderRadius from props.borderRadius
   - cursor: 'pointer'
   - border: 'none'
   - Merge with props.style if provided
3. Attach onClick handler to button
4. Render label as button text

## DOM Structure
```
<button class="button" style="..." onClick={...}>
  {label}
</button>
```

## Event Handling
- onClick should call props.onClick if provided
- If onClick is not provided, button should still be clickable but do nothing
- Prevent default form submission if button is in a form
- Handle disabled state if style includes disabled properties

## Default Export
Export the Button component as default export.

## Implementation Notes
- Use native button element for accessibility
- Button should be keyboard accessible (native behavior)
- Support focus states through CSS
- Handle onClick safely (check if function before calling)
- Button should have type="button" to prevent form submission
- Apply transition effects for hover states through external CSS if needed
- Text should not be selectable (user-select: none)
