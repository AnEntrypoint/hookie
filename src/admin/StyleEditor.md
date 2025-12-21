# StyleEditor Component

## Purpose
Provides modern UI controls for editing inline CSS styles of components. Offers sliders, color pickers, and quick utility buttons for common styles with smooth transitions, visual feedback, and beautiful tabbed interface.

## Component Type
React functional component with tabbed interface and real-time style preview

## Props
- `style` (object): Current inline style object
- `onChange` (function): Callback when style changes
  - Signature: `(updatedStyle) => void`

## State Management
Use React useState for:
- `localStyle` (object): Local copy of style being edited
- `activeTab` (string): Current tab ('spacing' | 'typography' | 'colors' | 'layout' | 'advanced')

## Tabs Structure
Organize style controls into tabs:

### Spacing Tab
- **Margin**: Slider (0-100px) or text input
  - Individual controls: margin-top, margin-right, margin-bottom, margin-left
  - Or unified margin control
- **Padding**: Slider (0-100px) or text input
  - Individual controls: padding-top, padding-right, padding-bottom, padding-left
  - Or unified padding control
- Toggle: "Link all sides" (apply same value to all sides)

### Typography Tab
- **Font Size**: Slider (8-72px) or text input
- **Font Weight**: Select dropdown (normal, bold, 100-900)
- **Line Height**: Slider (0.8-3) or text input
- **Letter Spacing**: Slider (-2px to 10px)
- **Text Align**: Button group (left, center, right, justify)
- **Text Transform**: Select (none, uppercase, lowercase, capitalize)
- **Text Decoration**: Select (none, underline, line-through)

### Colors Tab
- **Color**: Color picker + hex input
- **Background**: Color picker + hex input
  - Support gradients via text input
- **Border Color**: Color picker + hex input
- **Opacity**: Slider (0-1)

### Layout Tab
- **Display**: Select (block, inline-block, flex, grid, none)
- **Position**: Select (static, relative, absolute, fixed, sticky)
- **Width**: Text input (supports px, %, auto, vw)
- **Height**: Text input (supports px, %, auto, vh)
- **Max Width**: Text input
- **Max Height**: Text input
- **Overflow**: Select (visible, hidden, scroll, auto)
- **Z-Index**: Number input

### Flexbox Controls (shown if display=flex)
- **Flex Direction**: Button group (row, column, row-reverse, column-reverse)
- **Justify Content**: Button group (flex-start, center, flex-end, space-between, space-around)
- **Align Items**: Button group (flex-start, center, flex-end, stretch)
- **Gap**: Slider (0-100px)

### Grid Controls (shown if display=grid)
- **Grid Template Columns**: Text input
- **Grid Template Rows**: Text input
- **Gap**: Slider (0-100px)

### Border & Effects Tab
- **Border Width**: Slider (0-10px)
- **Border Style**: Select (none, solid, dashed, dotted)
- **Border Radius**: Slider (0-50px)
  - Individual corners option
- **Box Shadow**: Text input (preset buttons for common shadows)

### Advanced Tab
- **CSS Class**: Text input for custom CSS classes
- **Custom CSS**: Textarea for arbitrary CSS properties
  - Parse "property: value;" pairs

## Quick Utility Buttons
Provide one-click style presets:
- **Full Width**: Set width: '100%'
- **Center (Flex)**: display: flex, justifyContent: center, alignItems: center
- **Card Style**: padding: 20px, borderRadius: 8px, boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
- **Reset Styles**: Clear all inline styles

## Form Structure
```
<div class="style-editor">
  <div class="style-editor-tabs">
    <button onClick={() => setActiveTab('spacing')}>Spacing</button>
    <button onClick={() => setActiveTab('typography')}>Typography</button>
    <button onClick={() => setActiveTab('colors')}>Colors</button>
    <button onClick={() => setActiveTab('layout')}>Layout</button>
    <button onClick={() => setActiveTab('advanced')}>Advanced</button>
  </div>

  <div class="style-editor-content">
    {activeTab === 'spacing' && <SpacingControls />}
    {activeTab === 'typography' && <TypographyControls />}
    {activeTab === 'colors' && <ColorControls />}
    {activeTab === 'layout' && <LayoutControls />}
    {activeTab === 'advanced' && <AdvancedControls />}
  </div>

  <div class="style-editor-utilities">
    <button onClick={applyFullWidth}>Full Width</button>
    <button onClick={applyFlexCenter}>Center (Flex)</button>
    <button onClick={applyCardStyle}>Card Style</button>
    <button onClick={resetStyles}>Reset</button>
  </div>
</div>
```

## Event Handlers

### handleStyleChange(property, value)
```
(property, value) => {
  const updated = { ...localStyle, [property]: value };

  // Clean up undefined/null values
  Object.keys(updated).forEach(key => {
    if (updated[key] === undefined || updated[key] === null || updated[key] === '') {
      delete updated[key];
    }
  });

  setLocalStyle(updated);
  onChange(updated);
}
```

### handleMultipleStyleChanges(styleObject)
```
(styleObject) => {
  const updated = { ...localStyle, ...styleObject };
  setLocalStyle(updated);
  onChange(updated);
}
```

## Control Components

### Slider Control
```
<div class="style-control">
  <label>{label}</label>
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={parseFloat(localStyle[property]) || defaultValue}
    onChange={(e) => handleStyleChange(property, e.target.value + unit)}
  />
  <input
    type="text"
    value={localStyle[property] || ''}
    onChange={(e) => handleStyleChange(property, e.target.value)}
  />
</div>
```

### Color Picker Control
```
<div class="style-control">
  <label>{label}</label>
  <input
    type="color"
    value={localStyle[property] || '#000000'}
    onChange={(e) => handleStyleChange(property, e.target.value)}
  />
  <input
    type="text"
    value={localStyle[property] || ''}
    onChange={(e) => handleStyleChange(property, e.target.value)}
    placeholder="#000000"
  />
</div>
```

### Button Group Control
```
<div class="style-control">
  <label>{label}</label>
  <div class="button-group">
    {options.map(option => (
      <button
        key={option}
        class={localStyle[property] === option ? 'active' : ''}
        onClick={() => handleStyleChange(property, option)}
      >
        {option}
      </button>
    ))}
  </div>
</div>
```

## CSS Property Mapping
Map user-friendly names to CSS properties:
- "Font Size" -> fontSize
- "Background" -> background
- "Border Width" -> borderWidth
- etc.

## Value Parsing
- Extract numeric values from strings (e.g., '20px' -> 20)
- Preserve units when editing
- Auto-add units if missing (default to px for most properties)
- Support multiple units (px, %, em, rem, vh, vw)

## Default Export
Export the StyleEditor component as default export.

## Implementation Notes
- Use controlled inputs for all fields
- Real-time updates (no save button)
- Debounce onChange calls if performance issues
- Show visual preview of styles where possible (color swatches, etc.)
- Validate CSS values before applying
- Handle invalid values gracefully (revert to previous)
- Support keyboard input for precise values
- Provide visual indicators for active styles
- Group related properties logically
- Use icons for button groups where appropriate
- Support copy/paste of style objects
- Show current computed styles as hints
- Highlight modified properties
