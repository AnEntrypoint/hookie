# Image Component

## Purpose
Displays images with configurable dimensions and styling. Handles image loading and provides responsive image behavior.

## Component Type
React functional component

## Props
- `src` (string, required): Image source URL. Default: 'https://via.placeholder.com/400x300'
- `alt` (string, optional): Alternative text for accessibility. Default: 'Image'
- `width` (string, optional): CSS width value. Default: 'auto'
- `height` (string, optional): CSS height value. Default: 'auto'
- `borderRadius` (string, optional): CSS border-radius value. Default: '0'
- `style` (object, optional): Additional inline styles to merge

## Rendering Logic
1. Create an img element with className 'image'
2. Set src attribute from props.src
3. Set alt attribute from props.alt
4. Apply inline styles:
   - width from props.width
   - height from props.height
   - borderRadius from props.borderRadius
   - display: 'block'
   - maxWidth: '100%'
   - Merge with props.style if provided
5. Render the image element

## DOM Structure
```
<img
  class="image"
  src="..."
  alt="..."
  style="width: auto; height: auto; border-radius: 0; display: block; max-width: 100%; ..."
/>
```

## Default Export
Export the Image component as default export.

## Implementation Notes
- Use native img element
- Include alt text for accessibility
- max-width: 100% prevents overflow in containers
- display: block removes inline spacing issues
- Handle loading states with browser defaults
- Support object-fit through style prop if needed
- No lazy loading by default (can be added via style)
- Handle missing images with browser default broken image icon
- Images should be responsive by default
