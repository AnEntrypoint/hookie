# BuilderCanvas Component Specification

## Overview
Canvas area for building pages with drag-and-drop, preview modes, and undo/redo functionality.

## Props

### Input Props
```javascript
{
  pageData: Object,           // Current page data structure
  selectedId: String | null,  // Currently selected component ID
  onUpdate: Function,         // Callback when page data changes
  onSelectComponent: Function, // Callback to notify parent of selection
  canUndo: Boolean,           // Whether undo is available
  canRedo: Boolean,           // Whether redo is available
  onUndo: Function,           // Callback to undo last change
  onRedo: Function            // Callback to redo last undone change
}
```

## Performance Optimizations

### Memoize Component
Wrap BuilderCanvas with React.memo to prevent unnecessary re-renders:

```javascript
export default React.memo(function BuilderCanvas({
  pageData,
  selectedId,
  onUpdate,
  onSelectComponent,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if these props change
  return (
    prevProps.pageData === nextProps.pageData &&
    prevProps.selectedId === nextProps.selectedId &&
    prevProps.canUndo === nextProps.canUndo &&
    prevProps.canRedo === nextProps.canRedo
  );
});
```

### useCallback for Event Handlers
Memoize event handlers to maintain stable references:

```javascript
const handleDropComponent = useCallback((item) => {
  if (!item.componentType) return;

  const newComponent = {
    id: generateUniqueId(),
    type: item.componentType,
    props: getDefaultProps(item.componentType),
    style: {},
    children: [],
  };

  const newPageData = { ...pageData };
  if (!newPageData.components) {
    newPageData.components = [];
  }

  newPageData.components.push(newComponent);

  onUpdate(newPageData);
  onSelectComponent(newComponent.id);
}, [pageData, onUpdate, onSelectComponent]);

const handleComponentPropsChange = useCallback((componentId, newProps) => {
  // Props change handling logic
}, []);
```

### useMemo for Canvas Width Calculation
Cache canvas width to avoid recalculation:

```javascript
const canvasWidth = useMemo(() => {
  switch (previewMode) {
    case 'mobile': return '375px';
    case 'tablet': return '768px';
    default: return '100%';
  }
}, [previewMode]);
```

## State Management

### Local State
```javascript
const [previewMode, setPreviewMode] = useState('desktop');
```

## Toolbar Features

### Undo/Redo Buttons
Buttons with visual feedback for enabled/disabled states:

```javascript
<button
  onClick={onUndo}
  disabled={!canUndo}
  style={{
    ...styles.toolbarButton,
    opacity: !canUndo ? 0.5 : 1,
    cursor: !canUndo ? 'not-allowed' : 'pointer',
  }}
  title="Undo (Ctrl+Z)"
>
  ↶
</button>
<button
  onClick={onRedo}
  disabled={!canRedo}
  style={{
    ...styles.toolbarButton,
    opacity: !canRedo ? 0.5 : 1,
    cursor: !canRedo ? 'not-allowed' : 'pointer',
  }}
  title="Redo (Ctrl+Shift+Z)"
>
  ↷
</button>
```

### Preview Mode Selector
```javascript
<select
  value={previewMode}
  onChange={(e) => setPreviewMode(e.target.value)}
  style={styles.select}
>
  <option value="desktop">Desktop</option>
  <option value="tablet">Tablet (768px)</option>
  <option value="mobile">Mobile (375px)</option>
</select>
```

## Drag and Drop

### Drop Handler
```javascript
const [{ isOver }, drop] = useDrop(() => ({
  accept: 'COMPONENT',
  drop: (item) => handleDropComponent(item),
  collect: (monitor) => ({
    isOver: monitor.isOver(),
  }),
}));
```

### Handle Component Drop
```javascript
const handleDropComponent = (item) => {
  if (!item.componentType) return;

  const newComponent = {
    id: generateUniqueId(),
    type: item.componentType,
    props: getDefaultProps(item.componentType),
    style: {},
    children: [],
  };

  const newPageData = { ...pageData };
  if (!newPageData.components) {
    newPageData.components = [];
  }

  newPageData.components.push(newComponent);

  onUpdate(newPageData);
  onSelectComponent(newComponent.id);
};
```

## Canvas Sizing

### Responsive Preview
```javascript
// NOTE: Use useMemo for canvasWidth instead of function
// See Performance Optimizations section for canvasWidth calculation
```

## Selection Info

### Display Selected Component
```javascript
{selectedId && (
  <div style={styles.selectionInfo}>
    <span style={styles.selectionText}>Selected: {selectedId}</span>
    <button
      onClick={() => onSelectComponent(null)}
      style={styles.clearButton}
    >
      Clear Selection ×
    </button>
  </div>
)}
```

## Styles

### Component Styles
```javascript
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#f8fafc'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0'
  },
  toolbarButton: {
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#1e293b',
    transition: 'all 150ms ease',
  },
  separator: {
    width: '1px',
    height: '24px',
    backgroundColor: '#e2e8f0',
    margin: '0 8px'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
  },
  canvas: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    transition: 'background-color 150ms'
  },
  canvasInner: {
    transition: 'width 300ms',
    minHeight: '400px'
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '1rem',
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    backgroundColor: '#f8fafc'
  },
  selectionInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#dbeafe',
    borderTop: '1px solid #93c5fd'
  },
  selectionText: {
    fontSize: '0.875rem',
    color: '#1e40af',
    fontWeight: '500'
  },
  clearButton: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#1e40af',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
};
```

### Toolbar Button Hover Effect
Note: CSS-in-JS doesn't support :hover pseudo-class. For hover effects, use:
- Event handlers (onMouseEnter/onMouseLeave) for dynamic hover states, OR
- Add a className and use external CSS

For enabled toolbar buttons, add hover effect via background color change:
- Default: `backgroundColor: '#f1f5f9'`
- Hover: `backgroundColor: '#e2e8f0'`

## Helper Functions

### Get Default Props
```javascript
function getDefaultProps(componentType) {
  const schema = componentRegistry.getComponent(componentType);
  if (!schema || !schema.props) return {};

  const defaults = {};
  Object.entries(schema.props).forEach(([propName, propSchema]) => {
    if (propSchema.default !== undefined) {
      defaults[propName] = propSchema.default;
    }
  });

  return defaults;
}
```

## Dependencies
- react (useState, useMemo, useCallback)
- react-dnd (useDrop)
- ../public/Renderer
- ../lib/componentRegistry
- ./builderHelpers (generateUniqueId)

## Visual Feedback Requirements

### Undo/Redo Button States
1. **Disabled State** (canUndo/canRedo = false):
   - Opacity: 0.5
   - Cursor: not-allowed
   - Button disabled attribute: true

2. **Enabled State** (canUndo/canRedo = true):
   - Opacity: 1
   - Cursor: pointer
   - Interactive hover effect

3. **Transition**:
   - Smooth transition for all state changes (150ms ease)

### Implementation Notes
- Inline styles with conditional opacity/cursor based on can* props
- Transition property in base toolbarButton style for smooth feedback
- Disabled HTML attribute prevents clicks on disabled buttons
- Title attribute provides tooltip with keyboard shortcuts

## Performance Targets
- Initial render with 15 components: < 100ms
- Single component drop: < 50ms
- Preview mode change: < 30ms
- Selection change: < 20ms
- No unnecessary re-renders when toolbar buttons become enabled/disabled
