# ComponentCreator Component

## Purpose
Provides UI for defining custom component types. Allows users to create component schemas with custom props, validation rules, and containment rules.

## Component Type
React functional component

## Dependencies
- contentManager.md for saving component schemas
- componentRegistry.md for registering components

## Props
- `owner` (string): GitHub repository owner
- `repo` (string): Repository name
- `onComponentCreated` (function): Callback when component is created
  - Signature: `(componentName: string) => void`

## State Management
Use React useState for:
- `componentName` (string): Component name
- `description` (string): Component description
- `props` (array): Array of prop definitions
  - Each prop: { name, type, required, default, options }
- `allowedChildren` (string): Containment rule ('all', 'none', or 'specific')
- `specificChildren` (array): List of specific allowed child types
- `saving` (boolean): Saving state
- `error` (string|null): Error message

## Form Structure

### Component Info
- **Name**: Text input (PascalCase, required)
- **Description**: Textarea (description of component purpose)

### Props Builder
List of props with add/remove functionality:

For each prop:
- **Prop Name**: Text input (camelCase)
- **Type**: Select dropdown (string, number, boolean, array, object, node, function)
- **Required**: Checkbox
- **Default Value**: Input (varies by type)
- **Options**: Text input for enum values (comma-separated, only for string type)
- **Remove**: Button to remove prop

Add Prop button to add new prop definition

### Children Rules
- **Radio buttons**:
  - "Allow all child types" (allowedChildren: ['*'])
  - "No children allowed" (allowedChildren: [])
  - "Specific children only" (show multi-select of existing components)

### Default Styles
- Textarea for JSON object of default inline styles
- Example: `{ "display": "block", "padding": "10px" }`

## DOM Structure
```
<div class="component-creator">
  <h2>Create Custom Component</h2>

  <form onSubmit={handleSubmit}>
    <div class="form-section">
      <h3>Component Info</h3>

      <div class="form-field">
        <label>Component Name *</label>
        <input
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="MyCustomComponent"
          required
        />
        <span class="hint">PascalCase, e.g., CustomButton</span>
      </div>

      <div class="form-field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this component does..."
        />
      </div>
    </div>

    <div class="form-section">
      <h3>Props</h3>

      {props.map((prop, index) => (
        <div key={index} class="prop-editor">
          <input
            type="text"
            placeholder="propName"
            value={prop.name}
            onChange={(e) => updateProp(index, 'name', e.target.value)}
          />

          <select
            value={prop.type}
            onChange={(e) => updateProp(index, 'type', e.target.value)}
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="array">Array</option>
            <option value="object">Object</option>
            <option value="node">Node (children)</option>
            <option value="function">Function</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={prop.required}
              onChange={(e) => updateProp(index, 'required', e.target.checked)}
            />
            Required
          </label>

          <input
            type="text"
            placeholder="Default value"
            value={prop.default}
            onChange={(e) => updateProp(index, 'default', e.target.value)}
          />

          {prop.type === 'string' && (
            <input
              type="text"
              placeholder="Options (comma-separated)"
              value={prop.options ? prop.options.join(', ') : ''}
              onChange={(e) => updateProp(index, 'options', e.target.value.split(',').map(s => s.trim()))}
            />
          )}

          <button type="button" onClick={() => removeProp(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addProp}>
        + Add Prop
      </button>
    </div>

    <div class="form-section">
      <h3>Children Rules</h3>

      <label>
        <input
          type="radio"
          name="childrenRule"
          value="all"
          checked={allowedChildren === 'all'}
          onChange={(e) => setAllowedChildren('all')}
        />
        Allow all child types
      </label>

      <label>
        <input
          type="radio"
          name="childrenRule"
          value="none"
          checked={allowedChildren === 'none'}
          onChange={(e) => setAllowedChildren('none')}
        />
        No children allowed
      </label>

      <label>
        <input
          type="radio"
          name="childrenRule"
          value="specific"
          checked={allowedChildren === 'specific'}
          onChange={(e) => setAllowedChildren('specific')}
        />
        Specific children only
      </label>

      {allowedChildren === 'specific' && (
        <div class="specific-children">
          {/* Multi-select or checkboxes for component types */}
          <select
            multiple
            value={specificChildren}
            onChange={(e) => setSpecificChildren(Array.from(e.target.selectedOptions, opt => opt.value))}
          >
            {/* List all available component types from registry */}
          </select>
        </div>
      )}
    </div>

    {error && (
      <div class="error-message">{error}</div>
    )}

    <div class="form-actions">
      <button type="submit" disabled={saving}>
        {saving ? 'Creating...' : 'Create Component'}
      </button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </div>
  </form>
</div>
```

## Event Handlers

### addProp()
```
() => {
  setProps([
    ...props,
    { name: '', type: 'string', required: false, default: '', options: null }
  ]);
}
```

### removeProp(index)
```
(index) => {
  setProps(props.filter((_, i) => i !== index));
}
```

### updateProp(index, field, value)
```
(index, field, value) => {
  const updated = [...props];
  updated[index][field] = value;
  setProps(updated);
}
```

### handleSubmit(e)
```
async (e) => {
  e.preventDefault();

  // Validate
  if (!componentName.trim()) {
    setError('Component name is required');
    return;
  }

  if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
    setError('Component name must be PascalCase (e.g., MyComponent)');
    return;
  }

  // Build schema
  const schema = {
    name: componentName,
    description: description,
    props: {},
    allowedChildren: allowedChildren === 'all' ? ['*'] :
                     allowedChildren === 'none' ? [] :
                     specificChildren,
    defaultStyle: {}
  };

  // Convert props array to props object
  props.forEach(prop => {
    if (prop.name) {
      schema.props[prop.name] = {
        type: prop.type,
        required: prop.required,
        default: parseDefaultValue(prop.default, prop.type)
      };

      if (prop.options && prop.options.length > 0) {
        schema.props[prop.name].options = prop.options;
      }
    }
  });

  setSaving(true);
  try {
    // Save to GitHub
    await contentManager.saveComponentSchema(
      owner,
      repo,
      componentName,
      schema,
      `Create custom component: ${componentName}`
    );

    // Register in local registry
    componentRegistry.registerComponent(componentName, schema);

    // Notify parent
    onComponentCreated(componentName);

    // Reset form
    handleReset();
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
}
```

### parseDefaultValue(value, type)
```
(value, type) => {
  if (!value) return undefined;

  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return value === 'true' || value === true;
    case 'array':
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    case 'object':
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    default:
      return value;
  }
}
```

### handleReset()
```
() => {
  setComponentName('');
  setDescription('');
  setProps([]);
  setAllowedChildren('all');
  setSpecificChildren([]);
  setError(null);
}
```

## Validation Rules
- Component name must be PascalCase
- Component name must be unique (check registry)
- Prop names must be camelCase
- Prop names must be unique within component
- At least one prop should be defined (recommendation, not required)
- Default values must match prop type

## Default Export
Export the ComponentCreator component as default export.

## Implementation Notes
- Load existing component types from registry for children selection
- Provide helpful hints and examples
- Show preview of generated schema
- Validate form before submission
- Clear form after successful creation
- Handle JSON parsing errors gracefully
- Support editing existing component schemas (optional enhancement)
- Show success message after creation
- Auto-focus component name input on mount
- Prevent duplicate component names
- Consider adding prop validation rules (min, max, pattern)
