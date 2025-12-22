# ComponentPalette Component Specification

## Overview
Displays available components for drag-and-drop with search, descriptions, and enhanced page structure tree. Includes real-time filtering, component descriptions from registry, result counter, visual hierarchy with indentation, component type badges, expand/collapse state persistence, and type-based color coding.

## Search and Description Features

### Search Input with Clear Button
Add search filter that checks component name and description:

```javascript
const [searchTerm, setSearchTerm] = useState('');
const allComponents = componentRegistry.getAllComponents();

const filteredComponents = allComponents.filter(name => {
  const schema = componentRegistry.getComponent(name);
  const description = schema?.description || 'No description';
  const searchLower = searchTerm.toLowerCase();
  return name.toLowerCase().includes(searchLower) ||
         description.toLowerCase().includes(searchLower);
});
```

Search input layout:
- 100% width, padding 12px
- Border 1px solid #e2e8f0
- Search icon or placeholder text
- Clear button (red X) positioned absolute right, hidden when searchTerm is empty

### Component Description Display
Show description below component name in card:

```javascript
function ComponentCard({ type }) {
  const schema = componentRegistry.getComponent(type);
  const description = schema?.description || 'No description';

  // Truncate to max 2 lines using CSS
  return (
    <div style={styles.card}>
      <div style={styles.cardIcon}>{type.charAt(0)}</div>
      <div style={styles.cardName}>{type}</div>
      <div style={styles.cardDescription}>{description}</div>
    </div>
  );
}
```

Description styling:
- Color: #64748b (gray)
- Font-size: 0.875rem
- Max height: 2.5em (approximately 2 lines)
- Overflow: hidden with text-overflow: ellipsis
- White-space: normal for wrapping

### Results Counter
Display filtered count below search input:

```javascript
const matchCount = filteredComponents.length;
const totalCount = allComponents.length;

<div style={styles.resultCounter}>
  Showing {matchCount} of {totalCount} components
</div>
```

Results counter styling:
- Color: #94a3b8 (light gray)
- Font-size: 0.75rem
- Text-align: right
- Margin-top: 4px

### No Results Message
When search yields no matches:

```javascript
{filteredComponents.length === 0 ? (
  <div style={styles.noResults}>No components found</div>
) : (
  <div style={styles.palette}>
    {/* component cards */}
  </div>
)}
```

No results styling:
- Color: #94a3b8
- Font-size: 0.875rem
- Text-align: center
- Padding: 24px 12px

### Clear Button Implementation
Position clear button inside search input:

```javascript
<div style={styles.searchContainer}>
  <input
    type="text"
    placeholder="Search components..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={styles.searchInput}
  />
  {searchTerm && (
    <button
      onClick={() => setSearchTerm('')}
      style={styles.clearButton}
      title="Clear search"
    >
      ×
    </button>
  )}
</div>
```

Search container positioning:
- Position: relative
- Display: flex / block with input 100% width

Clear button styling:
- Position: absolute
- Right: 8px
- Top: 50% with transform translateY(-50%)
- Background: none
- Border: none
- Color: #ef4444 (red)
- Font-size: 1.25rem
- Cursor: pointer
- Padding: 4px 8px
- Only visible when searchTerm is not empty

## Props

### Input Props
```javascript
{
  pageData: Object,           // Current page data with components
  selectedId: String | null,  // Currently selected component ID
  onSelect: Function,         // Callback when component is selected
  onDelete: Function,         // Callback when component is deleted
  onDuplicate: Function       // Callback when component is duplicated
}
```

## State Management

### Local State
```javascript
const [searchTerm, setSearchTerm] = useState('');           // Immediate search input value
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounced value for filtering
```

## Component Structure

### Main Container
```javascript
<div style={styles.container}>
  <div style={styles.section}>
    <h3 style={styles.heading}>Components</h3>
    <input
      type="text"
      placeholder="Search components..."
      value={searchTerm}
      onChange={handleSearchChange}
      style={styles.searchInput}
    />
    <div style={styles.palette}>
      {componentTypes.map(type => (
        <ComponentCard key={type} type={type} />
      ))}
    </div>
  </div>

  <div style={styles.section}>
    <h3 style={styles.heading}>Page Structure</h3>
    <div style={styles.tree}>
      {pageData && pageData.components && pageData.components.map(component => (
        <TreeNode
          key={component.id}
          component={component}
          selectedId={selectedId}
          onSelect={onSelect}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  </div>
</div>
```

## Component Card Enhancement with Visual Previews

### Card Structure
Each ComponentCard should display:
1. Preview area (top) - visual component preview
2. Info section (bottom) - name, type badge, description, and props list

```javascript
function ComponentCard({ type }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { componentType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const schema = componentRegistry.getComponent(type);
  const description = schema?.description || 'No description';
  const props = schema?.props ? Object.keys(schema.props).slice(0, 4) : [];
  const componentType = getComponentType(type);

  return (
    <div
      ref={drag}
      style={{
        ...styles.card,
        opacity: isDragging ? 0.7 : 1,
      }}
    >
      <div style={styles.cardPreview}>
        <ComponentPreview type={type} />
      </div>
      <div style={styles.cardInfo}>
        <div style={styles.cardHeader}>
          <div style={styles.cardName}>{type}</div>
          <div style={styles.componentType}>{componentType}</div>
        </div>
        <div style={styles.cardDescription}>{description}</div>
        {props.length > 0 && (
          <div style={styles.cardProps}>
            Props: {props.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Component Type Classification
Classify components into visual categories for badge display:

```javascript
function getComponentType(componentName) {
  const types = {
    Button: 'Interactive',
    Link: 'Interactive',
    Text: 'Display',
    Heading: 'Display',
    Image: 'Display',
    Container: 'Container',
    Section: 'Container',
    Grid: 'Container',
    List: 'Display',
    Divider: 'Display'
  };
  return types[componentName] || 'Component';
}
```

### Component Preview Renderer
Create safe preview rendering with error handling:

```javascript
function ComponentPreview({ type }) {
  try {
    switch(type) {
      case 'Button':
        return (
          <div style={styles.previewContainer}>
            <button style={getPreviewButtonStyle()}>Click</button>
          </div>
        );

      case 'Text':
        return (
          <div style={styles.previewContainer}>
            <p style={styles.previewText}>Sample text</p>
          </div>
        );

      case 'Heading':
        return (
          <div style={styles.previewContainer}>
            <h3 style={styles.previewHeading}>Heading</h3>
          </div>
        );

      case 'Link':
        return (
          <div style={styles.previewContainer}>
            <a style={styles.previewLink} href="#">Link</a>
          </div>
        );

      case 'Image':
        return (
          <div style={styles.previewContainer}>
            <div style={styles.previewPlaceholder}>
              <span style={styles.previewIcon}>🖼</span>
            </div>
          </div>
        );

      case 'Container':
      case 'Section':
      case 'Grid':
        return (
          <div style={styles.previewContainer}>
            <div style={styles.previewBox} />
          </div>
        );

      case 'Divider':
        return (
          <div style={styles.previewContainer}>
            <div style={styles.previewDivider} />
          </div>
        );

      case 'List':
        return (
          <div style={styles.previewContainer}>
            <ul style={styles.previewList}>
              <li style={styles.previewListItem} />
              <li style={styles.previewListItem} />
            </ul>
          </div>
        );

      default:
        return (
          <div style={styles.previewContainer}>
            <div style={styles.previewPlaceholder}>
              <span style={styles.previewIcon}>?</span>
            </div>
          </div>
        );
    }
  } catch (error) {
    return (
      <div style={styles.previewContainer}>
        <div style={styles.previewError}>Error</div>
      </div>
    );
  }
}

function getPreviewButtonStyle() {
  return {
    padding: '8px 12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontWeight: '500'
  };
}
```

## Enhanced Tree Component Structure

### Component Type Detection and Icons
Each component type should be classified and displayed with appropriate icons and color badges:

```javascript
function getComponentTypeInfo(componentName) {
  const typeMap = {
    Container: { type: 'container', icon: '📦', color: '#3b82f6' },
    Section: { type: 'container', icon: '📦', color: '#3b82f6' },
    Grid: { type: 'container', icon: '📦', color: '#3b82f6' },
    Button: { type: 'interactive', icon: '🖱️', color: '#8b5cf6' },
    Link: { type: 'interactive', icon: '🖱️', color: '#8b5cf6' },
    Text: { type: 'display', icon: '🎨', color: '#ec4899' },
    Heading: { type: 'display', icon: '🎨', color: '#ec4899' },
    Image: { type: 'display', icon: '🎨', color: '#ec4899' },
    Divider: { type: 'display', icon: '🎨', color: '#ec4899' },
    List: { type: 'display', icon: '🎨', color: '#ec4899' },
  };
  return typeMap[componentName] || { type: 'unknown', icon: '▪', color: '#64748b' };
}
```

Type classifications:
- **Container** (blue): Can hold other components (Container, Section, Grid)
- **Interactive** (purple): User interaction components (Button, Link)
- **Display** (pink): Display/content components (Text, Heading, Image, Divider, List)

### Component Type Badge
Display small badge next to component type:

```javascript
<div style={styles.typeBadge(typeColor)}>
  {typeLabel}
</div>
```

Badge styling (dynamic based on type):
- Padding: 2px 6px
- Font-size: 0.65rem
- Font-weight: 600
- Border-radius: 3px
- Background: colored with 15% opacity
- Text: type color at full opacity
- Monospace font

### TreeNode Component Enhancement

```javascript
function TreeNode({ component, selectedId, onSelect, onDelete, onDuplicate, setDeleteConfirm, level = 0 }) {
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem(`componentTree_expanded_${component.id}`);
    return saved === null ? true : JSON.parse(saved);
  });

  const hasChildren = component.children && component.children.length > 0;
  const isSelected = component.id === selectedId;
  const typeInfo = getComponentTypeInfo(component.type);

  const handleToggleExpanded = (e) => {
    e.stopPropagation();
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    localStorage.setItem(`componentTree_expanded_${component.id}`, JSON.stringify(newExpanded));
  };

  return (
    <div>
      <div
        style={{
          ...styles.treeNode,
          paddingLeft: `${8 + level * 30}px`,
          backgroundColor: isSelected ? '#dbeafe' : 'transparent',
          borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent',
          minHeight: '40px',
        }}
        onClick={() => onSelect(component.id)}
      >
        <div style={styles.treeNodeContent}>
          {hasChildren ? (
            <button
              onClick={handleToggleExpanded}
              style={styles.expandButton}
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '▼' : '▶'}
            </button>
          ) : (
            <span style={styles.expandPlaceholder}>·</span>
          )}

          <span style={styles.componentIcon}>
            {typeInfo.icon}
          </span>

          <span style={styles.nodeTitle}>
            {getComponentTitle(component)}
          </span>

          <div style={styles.typeBadge(typeInfo.color)}>
            {component.type}
          </div>
        </div>

        <div style={styles.nodeActions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(component.id);
            }}
            style={styles.actionButton}
            title="Duplicate"
          >
            ⧉
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirm({
                componentId: component.id,
                componentName: getComponentTitle(component)
              });
            }}
            style={styles.deleteButton}
            title="Delete"
          >
            ×
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {component.children.map(child => (
            <TreeNode
              key={child.id}
              component={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              setDeleteConfirm={setDeleteConfirm}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Expand/Collapse State Persistence

Store expanded/collapsed state in localStorage:
- Key format: `componentTree_expanded_${componentId}`
- Value: boolean (true = expanded, false = collapsed)
- Load state on TreeNode mount using useState initializer
- Save state whenever user clicks expand/collapse button
- Automatically persist across page reloads

### Tree Item Layout and Spacing

Tree node structure with proper spacing and alignment:

```
Level 0:  ▼ 📦 Container       [Container]
Level 1:    ▶ 🎨 Text         [Display]
Level 1:    ▼ 📦 Section      [Container]
Level 2:      · 🖱️ Button     [Interactive]
```

Indentation calculations:
- Base padding: 8px (for left border area)
- Per-level indentation: 30px
- Total padding: `8px + (level * 30px)`

## Styles

```javascript
const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto' },
  section: { display: 'flex', flexDirection: 'column', gap: '12px' },
  heading: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', margin: 0 },
  searchContainer: { position: 'relative', display: 'flex' },
  searchInput: { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box' },
  clearButton: { position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#ef4444', fontSize: '1.25rem', cursor: 'pointer', padding: '4px 8px' },
  resultCounter: { color: '#94a3b8', fontSize: '0.75rem', textAlign: 'right', marginTop: '4px' },
  noResults: { color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', padding: '24px 12px' },

  palette: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },

  card: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'grab',
    transition: 'all 150ms ease-in-out',
    backgroundColor: '#ffffff',
    minHeight: '200px',
    maxHeight: '250px',
    overflow: 'hidden'
  },
  cardPreview: {
    flex: '0 0 120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px'
  },
  previewContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  previewText: {
    fontSize: '0.813rem',
    color: '#1e293b',
    margin: 0,
    lineHeight: '1.4'
  },
  previewHeading: {
    fontSize: '1rem',
    color: '#1e293b',
    fontWeight: '600',
    margin: 0
  },
  previewLink: {
    color: '#2563eb',
    textDecoration: 'underline',
    fontSize: '0.813rem',
    cursor: 'pointer'
  },
  previewPlaceholder: {
    width: '80px',
    height: '80px',
    backgroundColor: '#dbeafe',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewIcon: {
    fontSize: '2rem'
  },
  previewBox: {
    width: '80px',
    height: '60px',
    backgroundColor: '#dbeafe',
    borderRadius: '4px',
    border: '2px dashed #2563eb'
  },
  previewDivider: {
    width: '100%',
    height: '1px',
    backgroundColor: '#e0e0e0'
  },
  previewList: {
    margin: 0,
    padding: '0 12px',
    listStyle: 'none'
  },
  previewListItem: {
    width: '60px',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    marginBottom: '6px'
  },
  previewError: {
    fontSize: '0.75rem',
    color: '#ef4444',
    fontWeight: '500'
  },

  cardInfo: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'space-between'
  },
  cardName: { fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' },
  componentType: {
    fontSize: '0.65rem',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    padding: '2px 6px',
    borderRadius: '3px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  cardDescription: {
    fontSize: '0.75rem',
    color: '#64748b',
    maxHeight: '2em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    lineHeight: '1.3'
  },
  cardProps: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    marginTop: '4px'
  },
  tree: { display: 'flex', flexDirection: 'column' },
  treeNode: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', cursor: 'pointer', transition: 'background-color 150ms, border-left-color 150ms', position: 'relative' },
  treeNodeContent: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 },
  expandButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px', color: '#64748b', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  expandPlaceholder: { width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', flexShrink: 0 },
  componentIcon: { fontSize: '1rem', flexShrink: 0 },
  nodeTitle: { flex: 1, fontSize: '0.813rem', color: '#1e293b', fontFamily: "'Monaco', 'Courier New', monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  typeBadge: (color) => ({
    padding: '2px 6px',
    backgroundColor: color + '18',
    color: color,
    fontSize: '0.65rem',
    fontWeight: '600',
    borderRadius: '3px',
    fontFamily: "'Monaco', 'Courier New', monospace",
    flexShrink: 0,
    whiteSpace: 'nowrap',
  }),
  nodeActions: { display: 'flex', gap: '4px', opacity: 0.7, flexShrink: 0 },
  actionButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#2563eb', padding: '2px 4px' },
  deleteButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#ef4444', padding: '2px 4px' },
};
```

## Confirmation Dialog - Delete Component

### State Management
```javascript
const [deleteConfirm, setDeleteConfirm] = useState(null);
// deleteConfirm: { componentId: string, componentName: string } | null
```

### Confirmation Dialog UI
```javascript
{deleteConfirm && (
  <div style={styles.modalBackdrop}>
    <div style={styles.confirmModal}>
      <div style={styles.confirmContent}>
        <h3 style={styles.confirmTitle}>Remove component</h3>
        <p style={styles.confirmMessage}>
          Remove '{deleteConfirm.componentName}' from page? This cannot be undone.
        </p>
      </div>
      <div style={styles.confirmActions}>
        <button
          onClick={() => setDeleteConfirm(null)}
          style={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onDelete(deleteConfirm.componentId);
            setDeleteConfirm(null);
          }}
          style={styles.destructiveButton}
        >
          Remove
        </button>
      </div>
    </div>
  </div>
)}
```

### Modal Styles (part of main styles object)

```javascript
modalBackdrop: {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '1000',
},
confirmModal: {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
  maxWidth: '500px',
  width: '90%',
},
confirmContent: {
  padding: '24px',
},
confirmTitle: {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#111827',
  margin: '0 0 12px 0',
},
confirmMessage: {
  fontSize: '0.875rem',
  color: '#4b5563',
  margin: '0',
  lineHeight: '1.5',
},
confirmActions: {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  padding: '0 24px 24px 24px',
  borderTop: '1px solid #e5e7eb',
},
cancelButton: {
  padding: '10px 16px',
  minHeight: '44px',
  backgroundColor: '#f3f4f6',
  color: '#6b7280',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 150ms',
},
destructiveButton: {
  padding: '10px 16px',
  minHeight: '44px',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 150ms',
},
```

## Dependencies
- react (useState, useMemo, useCallback, useEffect, useRef)
- react-dnd (useDrag)
- ../lib/componentRegistry
- ./builderHelpers (getComponentTitle)
- ErrorAlert (error display component)
- errorHandlers (getErrorDetails function)

## Performance Targets
- Search input response: < 200ms debounce delay
- Component palette render with 20 components: < 50ms
- Tree node selection change: < 30ms
- No re-renders on canvas updates (only when pageData structure changes)
