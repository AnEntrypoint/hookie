# Renderer Component

## Purpose
Dynamically renders component trees from JSON page data. Recursively instantiates components based on their type definitions from the component registry.

## Component Type
React functional component

## Dependencies
- componentRegistry.md for component schemas
- All component modules (Section, Text, Button, Grid, Image, Heading, Container, Divider, Link)

## Props
- `pageData` (object): Page structure to render
  - Structure: { name, title, components: [] }
- `onSelectComponent` (function, optional): Callback when component is clicked (for builder mode)
  - Signature: `(componentId: string) => void`
- `selectedId` (string, optional): Currently selected component ID (for highlighting in builder)
- `mode` (string, optional): 'edit' or 'view' (default: 'view')

## Component Mapping
Create a mapping of component type names to actual React components:
```
const COMPONENT_MAP = {
  Section: Section,
  Text: Text,
  Button: Button,
  Grid: Grid,
  Image: Image,
  Heading: Heading,
  Container: Container,
  Divider: Divider,
  Link: Link,
  List: List,
  // ... custom components loaded dynamically
};
```

## Rendering Logic

### Main Render Function
```
const renderComponent = (component, index) => {
  const { id, type, props, style, children } = component;

  // Get component from registry
  const schema = componentRegistry.getComponent(type);
  if (!schema) {
    console.warn(`Component type "${type}" not found in registry`);
    return (
      <div key={id || index} class="component-error">
        Unknown component: {type}
      </div>
    );
  }

  // Get React component
  const Component = COMPONENT_MAP[type];
  if (!Component) {
    console.warn(`Component implementation for "${type}" not found`);
    return (
      <div key={id || index} class="component-error">
        Component not implemented: {type}
      </div>
    );
  }

  // Merge schema defaults with instance props
  const mergedProps = { ...getDefaultProps(schema), ...props };

  // Merge default style with instance style
  const mergedStyle = { ...schema.defaultStyle, ...style };

  // Render children recursively
  const renderedChildren = children && children.length > 0
    ? children.map((child, i) => renderComponent(child, i))
    : undefined;

  // Add edit mode wrapper if in edit mode
  if (mode === 'edit') {
    return (
      <div
        key={id || index}
        class={`component-wrapper ${selectedId === id ? 'selected' : ''}`}
        onClick={(e) => handleComponentClick(e, id)}
        data-component-id={id}
        data-component-type={type}
      >
        <Component
          {...mergedProps}
          style={mergedStyle}
          children={renderedChildren}
        />
      </div>
    );
  }

  // View mode: render directly
  return (
    <Component
      key={id || index}
      {...mergedProps}
      style={mergedStyle}
      children={renderedChildren}
    />
  );
};
```

### getDefaultProps(schema)
Extract default values from schema:
```
(schema) => {
  const defaults = {};

  Object.entries(schema.props).forEach(([propName, propSchema]) => {
    if (propSchema.default !== undefined) {
      defaults[propName] = propSchema.default;
    }
  });

  return defaults;
}
```

### handleComponentClick(e, id)
Handle click in edit mode:
```
(e, id) => {
  e.stopPropagation(); // Prevent bubbling to parent components

  if (onSelectComponent) {
    onSelectComponent(id);
  }
}
```

## Main Component
```
const Renderer = ({ pageData, onSelectComponent, selectedId, mode = 'view' }) => {
  if (!pageData || !pageData.components) {
    return <div>No content to display</div>;
  }

  return (
    <div class="renderer">
      {pageData.components.map((component, index) => renderComponent(component, index))}
    </div>
  );
};
```

## Error Handling
Handle missing components gracefully:
- Unknown component type → Show error placeholder
- Missing required props → Use schema defaults
- Invalid children → Skip or show warning
- Rendering errors → Catch with error boundary

## Performance Optimization
Use React.memo to prevent unnecessary re-renders:
```
const Renderer = React.memo(({ pageData, onSelectComponent, selectedId, mode }) => {
  // ... rendering logic
}, (prevProps, nextProps) => {
  // Custom comparison to prevent re-renders
  return (
    prevProps.pageData === nextProps.pageData &&
    prevProps.selectedId === nextProps.selectedId &&
    prevProps.mode === nextProps.mode
  );
});
```

## Edit Mode Features
When mode='edit':
- Wrap each component in a clickable div
- Add visual indicators (borders, padding)
- Add data attributes for debugging
- Highlight selected component
- Allow click-to-select

## DOM Structure (Edit Mode)
```
<div class="renderer">
  <div class="component-wrapper selected" data-component-id="comp-1" data-component-type="Container">
    <Container {...props} />
  </div>
  <div class="component-wrapper" data-component-id="comp-2" data-component-type="Heading">
    <Heading {...props} />
  </div>
</div>
```

## DOM Structure (View Mode)
```
<div class="renderer">
  <Container {...props} />
  <Heading {...props} />
</div>
```

## Custom Component Support
Load custom components dynamically:
```
const loadCustomComponents = async () => {
  const customSchemas = await contentManager.listComponentSchemas(owner, repo);

  for (const name of customSchemas) {
    const schema = await contentManager.loadComponentSchema(owner, repo, name);
    componentRegistry.registerComponent(name, schema);

    // Optionally: dynamically create React component wrapper
    // This is advanced - may require eval or dynamic imports
  }
};
```

For custom components without implementations, render a placeholder or basic wrapper.

## Recursive Rendering
Properly handle deeply nested component trees:
- Prevent infinite loops (set max depth limit)
- Preserve component hierarchy
- Pass children correctly to parent components
- Maintain unique keys for React reconciliation

## Props Transformation
Transform certain props before passing to components:
- Convert string event handlers to functions (if needed)
- Parse JSON strings to objects
- Coerce types based on schema

## Default Export
Export the Renderer component as default export.

## Implementation Notes
- Use component registry as single source of truth
- Memoize component lookups for performance
- Handle circular references in component tree
- Support lazy loading of component implementations
- Provide development mode warnings for debugging
- Validate component tree structure before rendering
- Support server-side rendering (SSR) if needed
- Handle async component loading
- Implement error boundaries around each component
- Log rendering errors to console in development
- Support hot reloading in development
- Cache rendered output where appropriate
