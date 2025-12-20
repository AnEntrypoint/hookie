# PropsEditor Component

## Purpose
Dynamic form generator that creates input fields based on component schema. Allows editing component props with validation and type coercion.

## Component Type
React functional component

## Dependencies
- componentRegistry.md for schema access and validation

## Props
- `component` (object): Component instance being edited
  - Structure: { id, type, props, style, children }
- `schema` (object): Component schema from componentRegistry
  - Structure: { name, props: { propName: { type, required, default, options } } }
- `onChange` (function): Callback when props change
  - Signature: `(updatedProps) => void`

## State Management
Use React useState for:
- `errors` (object): Validation errors keyed by prop name
- `localProps` (object): Local copy of props being edited

## Rendering Logic
For each prop in schema.props, generate appropriate input:

### String Type
- If has `options` array: render select dropdown
- Otherwise: render text input
- Input: `<input type="text" value={localProps[propName]} onChange={handleChange} />`

### Number Type
- Render number input with step controls
- Input: `<input type="number" value={localProps[propName]} onChange={handleChange} />`
- Coerce string to number on change

### Boolean Type
- Render checkbox
- Input: `<input type="checkbox" checked={localProps[propName]} onChange={handleChange} />`

### Color Type (detect by prop name containing 'color' or 'background')
- Render color picker
- Input: `<input type="color" value={localProps[propName]} onChange={handleChange} />`
- Include text input for manual entry

### Array Type
- Render textarea with JSON array editing
- Input: `<textarea value={JSON.stringify(localProps[propName])} onChange={handleChange} />`
- Validate JSON on blur
- Show "Add Item" / "Remove Item" buttons for simple arrays

### Object Type
- Render textarea with JSON object editing
- Input: `<textarea value={JSON.stringify(localProps[propName], null, 2)} onChange={handleChange} />`
- Validate JSON on blur

### Function Type
- Render code editor or textarea
- Display warning that functions can't be serialized
- Show placeholder: "Functions are not editable in visual editor"

### Node Type (children)
- Don't render input (children edited via Builder)
- Show info: "Children managed in canvas"

## Form Structure
```
<form class="props-editor">
  {Object.entries(schema.props).map(([propName, propSchema]) => (
    <div key={propName} class="props-editor-field">
      <label class="props-editor-label">
        {propName}
        {propSchema.required && <span class="required">*</span>}
      </label>

      {/* Render appropriate input based on type */}
      {renderInput(propName, propSchema)}

      {/* Show error if validation fails */}
      {errors[propName] && (
        <span class="props-editor-error">{errors[propName]}</span>
      )}

      {/* Show default value hint */}
      {propSchema.default && (
        <span class="props-editor-hint">Default: {propSchema.default}</span>
      )}
    </div>
  ))}
</form>
```

## Event Handlers

### handleChange(propName, value)
```
(propName, value) => {
  // Type coercion
  const coercedValue = coerceValue(value, schema.props[propName].type);

  // Update local state
  const updated = { ...localProps, [propName]: coercedValue };
  setLocalProps(updated);

  // Validate
  const validation = componentRegistry.validateComponentProps(component.type, updated);
  if (!validation.valid) {
    setErrors({ ...errors, [propName]: validation.errors.find(e => e.includes(propName)) });
  } else {
    setErrors({ ...errors, [propName]: null });
  }

  // Emit change
  onChange(updated);
}
```

### coerceValue(value, type)
```
(value, type) => {
  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return Boolean(value);
    case 'array':
      return Array.isArray(value) ? value : JSON.parse(value);
    case 'object':
      return typeof value === 'object' ? value : JSON.parse(value);
    default:
      return value;
  }
}
```

## Validation
- Validate on each change using componentRegistry.validateComponentProps()
- Show inline errors below fields
- Mark required fields with asterisk
- Highlight invalid fields with red border
- Prevent submission if validation fails (though this is auto-save)

## Special Handling

### Select Dropdowns
For props with `options` array:
```
<select value={localProps[propName]} onChange={handleChange}>
  {propSchema.options.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
</select>
```

### Color Picker
```
<div class="color-picker">
  <input type="color" value={localProps[propName]} onChange={handleChange} />
  <input type="text" value={localProps[propName]} onChange={handleChange} />
</div>
```

### JSON Editing
```
<textarea
  value={JSON.stringify(localProps[propName], null, 2)}
  onChange={handleJSONChange}
  onBlur={validateJSON}
/>
```

## Auto-save
- Emit onChange immediately on each edit (real-time updates)
- Debounce if performance issues arise
- No explicit "Save" button needed

## Default Export
Export the PropsEditor component as default export.

## Implementation Notes
- Use controlled inputs (value from props)
- Handle undefined/null props gracefully (use defaults)
- Type coercion should be forgiving (e.g., '5' -> 5)
- JSON validation should show helpful error messages
- Support copy/paste of complex values
- Consider using a JSON editor library for complex objects
- Group related props visually if many props exist
- Show prop descriptions as tooltips if available in schema
- Auto-focus first field on mount
- Handle rapid changes without lag
