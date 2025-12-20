# Component Registry

## Purpose
Manages the component type system for the page builder. Maintains a registry of component schemas that define available components, their props, validation rules, and containment hierarchies.

## Exports

### `registerComponent(name, schema)`
Registers a new component type with its schema.

**Parameters:**
- `name` (string): Unique component identifier
- `schema` (object): Component schema definition
  - `name` (string): Component name (should match `name` parameter)
  - `description` (string): Human-readable description
  - `props` (object): Props schema definition
    - Each key is a prop name, value is an object with:
      - `type` (string): 'string' | 'number' | 'boolean' | 'function' | 'array' | 'object' | 'node'
      - `required` (boolean): Whether prop is required
      - `default` (any): Default value if not provided
      - `options` (array, optional): Valid values for enum-like props
  - `allowedChildren` (array): Array of allowed child component names, or ['*'] for all types, or [] for none
  - `defaultStyle` (object): Default inline styles to apply

**Returns:** void

**Behavior:**
- Store schema in internal registry map
- Overwrite if component name already exists
- Validate schema structure before storing

### `getComponent(name)`
Retrieves a component schema by name.

**Parameters:**
- `name` (string): Component name

**Returns:** Schema object or undefined if not found

### `getAllComponents()`
Gets all registered component types.

**Parameters:** None

**Returns:** Object map of all schemas, keyed by component name

### `validateComponentProps(componentName, props)`
Validates props against a component's schema.

**Parameters:**
- `componentName` (string): Name of component to validate against
- `props` (object): Props to validate

**Returns:** Object with:
- `valid` (boolean): Whether validation passed
- `errors` (array): Array of error messages if validation failed

**Validation Rules:**
- Check all required props are present
- Verify prop types match schema
- Ensure enum props have valid values
- Allow extra props not in schema (for flexibility)

### `canContainChild(parentType, childType)`
Checks if a parent component can contain a specific child type.

**Parameters:**
- `parentType` (string): Parent component name
- `childType` (string): Child component name

**Returns:** Boolean

**Logic:**
- If parent's allowedChildren includes '*', return true
- If parent's allowedChildren is empty array, return false
- If parent's allowedChildren includes childType, return true
- Otherwise return false

## Internal State
Maintain a Map or object to store schemas, keyed by component name.

## Pre-loaded Components
On module initialization, register these base components:

### Section
```
{
  name: 'Section',
  description: 'Container with padding and background',
  props: {
    title: { type: 'string', required: false, default: '' },
    padding: { type: 'string', required: false, default: '20px' },
    background: { type: 'string', required: false, default: 'transparent' },
    children: { type: 'node', required: false }
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
    content: { type: 'string', required: true, default: 'Enter text' },
    fontSize: { type: 'string', required: false, default: '16px' },
    color: { type: 'string', required: false, default: '#000000' },
    fontWeight: { type: 'string', required: false, default: 'normal' },
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
    label: { type: 'string', required: true, default: 'Click me' },
    onClick: { type: 'function', required: false },
    background: { type: 'string', required: false, default: '#007bff' },
    color: { type: 'string', required: false, default: '#ffffff' },
    padding: { type: 'string', required: false, default: '10px 20px' },
    borderRadius: { type: 'string', required: false, default: '4px' }
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
    columns: { type: 'number', required: false, default: 2 },
    gap: { type: 'string', required: false, default: '16px' },
    children: { type: 'node', required: false }
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
    src: { type: 'string', required: true, default: 'https://via.placeholder.com/400x300' },
    alt: { type: 'string', required: false, default: 'Image' },
    width: { type: 'string', required: false, default: 'auto' },
    height: { type: 'string', required: false, default: 'auto' },
    borderRadius: { type: 'string', required: false, default: '0' }
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
    text: { type: 'string', required: true, default: 'Heading' },
    color: { type: 'string', required: false, default: '#000000' },
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
    maxWidth: { type: 'string', required: false, default: '1200px' },
    children: { type: 'node', required: false }
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
    color: { type: 'string', required: false, default: '#e0e0e0' },
    height: { type: 'string', required: false, default: '1px' },
    margin: { type: 'string', required: false, default: '16px 0' }
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
    href: { type: 'string', required: true, default: '#' },
    text: { type: 'string', required: true, default: 'Link' },
    color: { type: 'string', required: false, default: '#007bff' },
    underline: { type: 'boolean', required: false, default: true }
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
    items: { type: 'array', required: true, default: ['Item 1', 'Item 2', 'Item 3'] },
    color: { type: 'string', required: false, default: '#000000' }
  },
  allowedChildren: [],
  defaultStyle: {}
}
```

## Implementation Notes
- Use a simple object or Map for storage
- Perform deep cloning when returning schemas to prevent external mutation
- Log warnings if attempting to use unregistered components
- Type coercion should be lenient (e.g., '5' -> 5 for number types)
