import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import componentRegistry from '../lib/componentRegistry';
import { getComponentTitle } from './builderHelpers';

export default function ComponentPalette({ pageData, selectedId, onSelect, onDelete, onDuplicate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const allComponents = componentRegistry.getAllComponents();

  const componentTypes = allComponents.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.heading}>Components</h3>
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
  );
}

function ComponentCard({ type }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { componentType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        ...styles.card,
        opacity: isDragging ? 0.7 : 1,
      }}
    >
      <div style={styles.cardIcon}>{type.charAt(0)}</div>
      <div style={styles.cardName}>{type}</div>
    </div>
  );
}

function TreeNode({ component, selectedId, onSelect, onDelete, onDuplicate, level = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = component.children && component.children.length > 0;
  const isSelected = component.id === selectedId;

  return (
    <div>
      <div
        style={{
          ...styles.treeNode,
          paddingLeft: `${12 + level * 12}px`,
          backgroundColor: isSelected ? '#dbeafe' : 'transparent',
          borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent',
        }}
        onClick={() => onSelect(component.id)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            style={styles.expandButton}
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
        <span style={styles.nodeTitle}>{getComponentTitle(component)}</span>
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
              onDelete(component.id);
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
  searchInput: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem' },
  palette: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' },
  card: { padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center', cursor: 'grab', transition: 'all 150ms', backgroundColor: '#ffffff' },
  cardIcon: { width: '40px', height: '40px', margin: '0 auto 8px', backgroundColor: '#dbeafe', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '600', color: '#2563eb' },
  cardName: { fontSize: '0.75rem', fontWeight: '500', color: '#1e293b' },
  tree: { display: 'flex', flexDirection: 'column' },
  treeNode: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer', transition: 'all 150ms', position: 'relative' },
  expandButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '2px', color: '#64748b' },
  nodeTitle: { flex: 1, fontSize: '0.813rem', color: '#1e293b' },
  nodeActions: { display: 'flex', gap: '4px', opacity: 0.7 },
  actionButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#2563eb', padding: '2px 4px' },
  deleteButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#ef4444', padding: '2px 4px' },
};
