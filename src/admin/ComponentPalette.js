import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import componentRegistry from '../lib/componentRegistry';
import { getComponentTitle } from './builderHelpers';

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

export default function ComponentPalette({ pageData, selectedId, onSelect, onDelete, onDuplicate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const allComponents = componentRegistry.getAllComponents();

  const filteredComponents = allComponents.filter(name => {
    const schema = componentRegistry.getComponent(name);
    const description = schema?.description || 'No description';
    const searchLower = searchTerm.toLowerCase();
    return name.toLowerCase().includes(searchLower) ||
           description.toLowerCase().includes(searchLower);
  });

  return (
    <>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.heading}>Components</h3>
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
          <div style={styles.resultCounter}>
            Showing {filteredComponents.length} of {allComponents.length} components
          </div>
          {allComponents.length === 0 ? (
            <div style={styles.emptyStateContainer}>
              <div style={styles.emptyIcon}>🔧</div>
              <h3 style={styles.emptyTitle}>No custom components yet</h3>
              <p style={styles.emptyDescription}>
                Create components to extend your design system.
                Click "Create Component" in the admin menu.
              </p>
            </div>
          ) : filteredComponents.length === 0 ? (
            <div style={styles.noResults}>No components found</div>
          ) : (
            <div style={styles.palette}>
              {filteredComponents.map(type => (
                <ComponentCard key={type} type={type} />
              ))}
            </div>
          )}
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
                setDeleteConfirm={setDeleteConfirm}
              />
            ))}
          </div>
        </div>
      </div>

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
    </>
  );
}

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

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto' },
  section: { display: 'flex', flexDirection: 'column', gap: '12px' },
  heading: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', margin: 0 },
  searchContainer: { position: 'relative', display: 'flex' },
  searchInput: { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box' },
  clearButton: { position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#ef4444', fontSize: '1.25rem', cursor: 'pointer', padding: '4px 8px' },
  resultCounter: { color: '#94a3b8', fontSize: '0.75rem', textAlign: 'right', marginTop: '4px' },
  noResults: { color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', padding: '24px 12px' },
  emptyStateContainer: { padding: '60px 40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px' },
  emptyIcon: { fontSize: '3.5rem', marginBottom: '20px', display: 'block' },
  emptyTitle: { fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '12px', margin: '0 0 12px 0' },
  emptyDescription: { fontSize: '0.95rem', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6', margin: '0 0 24px 0' },

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
  cardPreview: {
    height: '80px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    justifyContent: 'space-between',
  },
  componentType: {
    fontSize: '0.6rem',
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardProps: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: '1.2',
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
  },
  previewText: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#1e293b',
  },
  previewHeading: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#1e293b',
    fontWeight: '600',
  },
  previewLink: {
    fontSize: '0.75rem',
    color: '#2563eb',
    textDecoration: 'none',
  },
  previewPlaceholder: {
    width: '40px',
    height: '40px',
    backgroundColor: '#dbeafe',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewIcon: {
    fontSize: '1.5rem',
  },
  previewBox: {
    width: '40px',
    height: '40px',
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
  },
  previewDivider: {
    width: '50px',
    height: '2px',
    backgroundColor: '#cbd5e1',
  },
  previewList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  previewListItem: {
    width: '50px',
    height: '4px',
    backgroundColor: '#cbd5e1',
    borderRadius: '2px',
  },
  previewError: {
    color: '#ef4444',
    fontSize: '0.75rem',
  },
};
