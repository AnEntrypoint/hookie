# Renderer Component Specification

## Overview
Renders page components recursively with support for view and edit modes. Optimized for performance with large component trees (10+ components).

## Performance Optimizations

### React.memo for Component Rendering
Memoize the entire Renderer component to prevent unnecessary re-renders when parent updates but props haven't changed:

```javascript
const Renderer = React.memo(({
  pageData,
  mode = 'view',
  selectedId,
  onSelectComponent,
  onPropsChange
}) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.mode === nextProps.mode &&
    prevProps.selectedId === nextProps.selectedId &&
    prevProps.pageData === nextProps.pageData &&
    prevProps.onSelectComponent === nextProps.onSelectComponent &&
    prevProps.onPropsChange === nextProps.onPropsChange
  );
});
```

### Memoize Individual Component Rendering
Create a memoized component wrapper to prevent re-rendering of unchanged components:

```javascript
const MemoizedComponent = React.memo(({
  Component,
  componentProps,
  id,
  type,
  mode,
  isSelected,
  onSelectComponent
}) => {
  if (mode === 'edit') {
    const handleClick = (e) => {
      e.stopPropagation();
      if (onSelectComponent) {
        onSelectComponent(id);
      }
    };

    return (
      <div
        className={`builder-component-wrapper ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
        data-component-id={id}
        data-component-type={type}
        style={{
          position: 'relative',
          outline: isSelected ? '2px solid #2563eb' : 'none',
          backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
          borderRadius: '4px',
          transition: 'all 150ms ease-in-out',
          cursor: 'pointer'
        }}
      >
        <Component {...componentProps} />

        {isSelected && (
          <div style={{
            position: 'absolute',
            top: '-24px',
            left: '0',
            fontSize: '11px',
            color: '#2563eb',
            fontWeight: '600',
            backgroundColor: '#dbeafe',
            padding: '2px 8px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {type}
          </div>
        )}
      </div>
    );
  }

  return <Component {...componentProps} />;
}, (prevProps, nextProps) => {
  // Only re-render if relevant props changed
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.mode === nextProps.mode &&
    JSON.stringify(prevProps.componentProps) === JSON.stringify(nextProps.componentProps)
  );
});
```

### useMemo for Default Props
Cache default props calculation to avoid repeated schema lookups:

```javascript
const getDefaultProps = useMemo(() => {
  return (schema) => {
    const defaults = {};

    if (!schema.props) return defaults;

    Object.entries(schema.props).forEach(([propName, propSchema]) => {
      if (propSchema.default !== undefined) {
        defaults[propName] = propSchema.default;
      }
    });

    return defaults;
  };
}, []);
```

### useCallback for Render Function
Memoize the renderComponent function to maintain stable references:

```javascript
const renderComponent = useCallback((component, index, parent) => {
  if (!component) return null;

  const { id, type, props, style, children } = component;

  // Get component schema from registry
  const schema = componentRegistry.getComponent(type);
  if (!schema) {
    return (
      <div key={id || index} style={{
        padding: '12px',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '4px',
        color: '#991b1b',
        fontSize: '14px'
      }}>
        Unknown component: {type}
      </div>
    );
  }

  // Get React component implementation
  const Component = COMPONENT_MAP[type];
  if (!Component) {
    return (
      <div key={id || index} style={{
        padding: '12px',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '4px',
        color: '#991b1b',
        fontSize: '14px'
      }}>
        Component not implemented: {type}
      </div>
    );
  }

  // Merge schema default props with instance props
  const mergedProps = { ...getDefaultProps(schema), ...(props || {}) };

  // Merge default style with instance style
  const mergedStyle = { ...schema.defaultStyle, ...(style || {}) };

  // Render children recursively
  const renderedChildren = children && children.length > 0
    ? children.map((child, i) => renderComponent(child, i, component))
    : undefined;

  // Build final props for component
  const componentProps = {
    ...mergedProps,
    style: mergedStyle,
    children: renderedChildren
  };

  const isSelected = selectedId === id;

  return (
    <MemoizedComponent
      key={id || index}
      Component={Component}
      componentProps={componentProps}
      id={id}
      type={type}
      mode={mode}
      isSelected={isSelected}
      onSelectComponent={onSelectComponent}
    />
  );
}, [mode, selectedId, onSelectComponent, getDefaultProps]);
```

## Props

### Input Props
```javascript
{
  pageData: Object,           // Page data with components array
  mode: String,               // 'view' or 'edit' (default: 'view')
  selectedId: String | null,  // Currently selected component ID (edit mode)
  onSelectComponent: Function, // Callback when component is selected (edit mode)
  onPropsChange: Function     // Callback when props change (edit mode)
}
```

## Component Structure

### COMPONENT_MAP
Static mapping of component types to React components:

```javascript
const COMPONENT_MAP = {
  Button,
  Text,
  Container,
  Section,
  Heading,
  Image,
  Grid,
  Divider,
  Link,
  List
};
```

## Main Render Logic

### Component Tree Rendering
```javascript
if (!pageData || !pageData.components) {
  return <div style={{ padding: '20px', color: '#64748b' }}>No content to display</div>;
}

return (
  <div className="renderer" style={{ width: '100%' }}>
    {pageData.components.map((component, index) =>
      renderComponent(component, index, null)
    )}
  </div>
);
```

## Dependencies
- react (React, useMemo, useCallback)
- ../lib/componentRegistry
- ../components/Button
- ../components/Text
- ../components/Container
- ../components/Section
- ../components/Heading
- ../components/Image
- ../components/Grid
- ../components/Divider
- ../components/Link
- ../components/List

## Performance Targets
- Initial render with 15 components: < 100ms
- Single component prop update: < 50ms
- Selection change: < 30ms
- No unnecessary re-renders of unchanged components
