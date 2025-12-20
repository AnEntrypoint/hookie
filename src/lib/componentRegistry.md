# Component Registry

## Purpose
Manages the component type system for the page builder. Maintains a registry of component schemas that define available components, their props, validation rules, and containment hierarchies.

## Exports

### `registerComponent(name, schema)`
Registers a new component type with its schema.

**Parameters:**
- `name` (string, required): Unique component identifier
- `schema` (object, required): Component schema definition with REQUIRED fields:
  - `name` (string, required): Component name (must match `name` parameter)
  - `description` (string, required): Human-readable description
  - `props` (object, required): Props schema definition where each key is a prop name with value object containing:
    - `type` (string, required): One of 'string' | 'number' | 'boolean' | 'function' | 'array' | 'object' | 'node'
    - `required` (boolean, required): Whether prop is required
    - `default` (any, required): Default value if not provided
    - `options` (array): Valid values for enum-like props (empty array if not applicable)
  - `allowedChildren` (array, required): Array of allowed child component names, or ['*'] for all types, or [] for none
  - `defaultStyle` (object, required): Default inline styles to apply (empty object if no defaults)

**Returns:** void

**Behavior:**
- Stores schema in internal registry Map with name as key
- Overwrites existing schema if component name already exists
- MUST validate schema structure before storing and throw ValidationError if invalid

### `getComponent(name)`
Retrieves a component schema by name.

**Parameters:**
- `name` (string, required): Component name

**Returns:** Schema object if found, undefined if not found

### `getAllComponents()`
Gets all registered component types.

**Parameters:** None

**Returns:** Object map of all schemas, keyed by component name

### `validateComponentProps(componentName, props)`
Validates props against a component's schema.

**Parameters:**
- `componentName` (string, required): Name of component to validate against
- `props` (object, required): Props to validate

**Returns:** Object with exactly these fields:
- `valid` (boolean): Whether validation passed
- `errors` (array): Array of error message strings (empty array if validation passed)

**Validation Rules (all MUST be checked):**
- Check all required props are present
- Verify prop types match schema exactly
- Ensure enum props (those with options array) have values included in options
- Allow extra props not in schema

### `canContainChild(parentType, childType)`
Checks if a parent component can contain a specific child type.

**Parameters:**
- `parentType` (string, required): Parent component name
- `childType` (string, required): Child component name

**Returns:** Boolean

**Logic (evaluated in this exact order):**
- If parent schema not found, return false
- If parent's allowedChildren includes '*', return true
- If parent's allowedChildren is empty array, return false
- If parent's allowedChildren includes childType, return true
- Otherwise return false

## Internal State
MUST maintain a Map to store schemas, keyed by component name.

## Pre-loaded Components
On module initialization, MUST register these exact base components with these exact schemas:

### Section
```
{
  name: 'Section',
  description: 'Container with padding and background',
  props: {
    title: { type: 'string', required: false, default: '', options: [] },
    padding: { type: 'string', required: false, default: '20px', options: [] },
    background: { type: 'string', required: false, default: 'transparent', options: [] },
    children: { type: 'node', required: false, default: null, options: [] }
  },
  allowedChildren: ['*'],
  defaultStyle: {}
}
```

### Text
```
{
  name: 'Text',
  description: 'Text content component',
  props: {
    content: { type: 'string', required: true, default: 'Enter text', options: [] },
    fontSize: { type: 'string', required: false, default: '16px', options: [] },
    color: { type: 'string', required: false, default: '#000000', options: [] },
    fontWeight: { type: 'string', required: false, default: 'normal', options: [] },
    align: { type: 'string', required: false, default: 'left', options: ['left', 'center', 'right', 'justify'] }
  },
  allowedChildren: [],
  defaultStyle: {}
}
```

### Button
```
{
  name: 'Button',
  description: 'Interactive button',
  props: {
    label: { type: 'string', required: true, default: 'Click me', options: [] },
    onClick: { type: 'function', required: false, default: null, options: [] },
    background: { type: 'string', required: false, default: '#007bff', options: [] },
    color: { type: 'string', required: false, default: '#ffffff', options: [] },
    padding: { type: 'string', required: false, default: '10px 20px', options: [] },
    borderRadius: { type: 'string', required: false, default: '4px', options: [] }
  },
  allowedChildren: [],
  defaultStyle: { cursor: 'pointer', border: 'none' }
}
```

### Grid
```
{
  name: 'Grid',
  description: 'CSS Grid layout container',
  props: {
    columns: { type: 'number', required: false, default: 2, options: [] },
    gap: { type: 'string', required: false, default: '16px', options: [] },
    children: { type: 'node', required: false, default: null, options: [] }
  },
  allowedChildren: ['*'],
  defaultStyle: { display: 'grid' }
}
```

### Image
```
{
  name: 'Image',
  description: 'Image component',
  props: {
    src: { type: 'string', required: true, default: 'https://via.placeholder.com/400x300', options: [] },
    alt: { type: 'string', required: false, default: 'Image', options: [] },
    width: { type: 'string', required: false, default: 'auto', options: [] },
    height: { type: 'string', required: false, default: 'auto', options: [] },
    borderRadius: { type: 'string', required: false, default: '0', options: [] }
  },
  allowedChildren: [],
  defaultStyle: { display: 'block', maxWidth: '100%' }
}
```

### Heading
```
{
  name: 'Heading',
  description: 'Heading component (h1-h6)',
  props: {
    level: { type: 'number', required: false, default: 1, options: [1, 2, 3, 4, 5, 6] },
    text: { type: 'string', required: true, default: 'Heading', options: [] },
    color: { type: 'string', required: false, default: '#000000', options: [] },
    align: { type: 'string', required: false, default: 'left', options: ['left', 'center', 'right'] }
  },
  allowedChildren: [],
  defaultStyle: {}
}
```

### Container
```
{
  name: 'Container',
  description: 'Simple wrapper with max-width',
  props: {
    maxWidth: { type: 'string', required: false, default: '1200px', options: [] },
    children: { type: 'node', required: false, default: null, options: [] }
  },
  allowedChildren: ['*'],
  defaultStyle: { margin: '0 auto', padding: '0 16px' }
}
```

### Divider
```
{
  name: 'Divider',
  description: 'Horizontal separator',
  props: {
    color: { type: 'string', required: false, default: '#e0e0e0', options: [] },
    height: { type: 'string', required: false, default: '1px', options: [] },
    margin: { type: 'string', required: false, default: '16px 0', options: [] }
  },
  allowedChildren: [],
  defaultStyle: { border: 'none' }
}
```

### Link
```
{
  name: 'Link',
  description: 'Hyperlink component',
  props: {
    href: { type: 'string', required: true, default: '#', options: [] },
    text: { type: 'string', required: true, default: 'Link', options: [] },
    color: { type: 'string', required: false, default: '#007bff', options: [] },
    underline: { type: 'boolean', required: false, default: true, options: [] }
  },
  allowedChildren: [],
  defaultStyle: {}
}
```

### List
```
{
  name: 'List',
  description: 'Ordered or unordered list',
  props: {
    type: { type: 'string', required: false, default: 'ul', options: ['ul', 'ol'] },
    items: { type: 'array', required: true, default: ['Item 1', 'Item 2', 'Item 3'], options: [] },
    color: { type: 'string', required: false, default: '#000000', options: [] }
  },
  allowedChildren: [],
  defaultStyle: {}
}
```

## Implementation Notes
- MUST use a Map for internal storage (not plain object)
- MUST perform deep cloning using JSON.parse(JSON.stringify()) when returning schemas to prevent external mutation
- MUST throw ComponentNotFoundError when attempting to validate props for unregistered components
- Type coercion MUST be applied: convert '5' to number 5 for number types, 'true' to boolean true for boolean types
