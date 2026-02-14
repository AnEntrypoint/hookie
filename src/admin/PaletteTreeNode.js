import React, { useState } from 'react';
import { getComponentTitle } from './builderHelpers';
import { styles } from './componentPaletteStyles';

function getComponentTypeInfo(componentName) {
  const typeMap = {
    Container: { icon: '[ ]', color: '#3b82f6' },
    Section: { icon: '[ ]', color: '#3b82f6' },
    Grid: { icon: '[ ]', color: '#3b82f6' },
    Button: { icon: '[x]', color: '#8b5cf6' },
    Link: { icon: '[x]', color: '#8b5cf6' },
    Text: { icon: 'Aa', color: '#ec4899' },
    Heading: { icon: 'H', color: '#ec4899' },
    Image: { icon: 'Img', color: '#ec4899' },
    Divider: { icon: '---', color: '#ec4899' },
    List: { icon: '=', color: '#ec4899' },
  };
  return typeMap[componentName] || { icon: '*', color: '#64748b' };
}

export { getComponentTypeInfo };

export default function PaletteTreeNode({ component, selectedId, onSelect, onDelete, onDuplicate, setDeleteConfirm, level = 0 }) {
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
            <button onClick={handleToggleExpanded} style={styles.expandButton} title={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? 'v' : '>'}
            </button>
          ) : (
            <span style={styles.expandPlaceholder}>.</span>
          )}
          <span style={styles.componentIcon}>{typeInfo.icon}</span>
          <span style={styles.nodeTitle}>{getComponentTitle(component)}</span>
          <div style={styles.typeBadge(typeInfo.color)}>{component.type}</div>
        </div>
        <div style={styles.nodeActions}>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(component.id); }}
            style={styles.actionButton}
            title="Duplicate"
          >
            ++
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirm({ componentId: component.id, componentName: getComponentTitle(component) });
            }}
            style={styles.deleteButton}
            title="Delete"
          >
            x
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {component.children.map(child => (
            <PaletteTreeNode
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
