import React, { useState } from 'react';
import { getComponentTitle } from './builderHelpers';
import componentRegistry from '../lib/componentRegistry';

const CATEGORY_COLORS = {
  Layout: '#3b82f6',
  Content: '#ec4899',
  Interactive: '#8b5cf6',
  Display: '#f59e0b',
};

function getComponentTypeInfo(componentName) {
  const schema = componentRegistry.getComponent(componentName);
  const category = schema?.category || 'Custom';
  return {
    icon: schema?.icon || '*',
    color: CATEGORY_COLORS[category] || '#64748b',
  };
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
        className="flex items-center gap-2 px-3 py-2 cursor-pointer relative"
        style={{
          paddingLeft: `${8 + level * 30}px`,
          backgroundColor: isSelected ? '#dbeafe' : 'transparent',
          borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent',
          minHeight: '40px',
        }}
        onClick={() => onSelect(component.id)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {hasChildren ? (
            <button onClick={handleToggleExpanded} className="bg-none border-none cursor-pointer text-xs p-0.5 text-slate-500 w-5 h-5 flex items-center justify-center shrink-0" title={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? 'v' : '>'}
            </button>
          ) : (
            <span className="w-5 h-5 flex items-center justify-center text-slate-300 shrink-0">.</span>
          )}
          <span className="text-base shrink-0">{typeInfo.icon}</span>
          <span className="flex-1 text-[0.813rem] text-slate-800 font-mono overflow-hidden text-ellipsis whitespace-nowrap">{getComponentTitle(component)}</span>
          <div style={{ padding: '2px 6px', backgroundColor: typeInfo.color + '18', color: typeInfo.color, fontSize: '0.65rem', fontWeight: '600', borderRadius: '3px', fontFamily: "'Monaco', 'Courier New', monospace", flexShrink: 0, whiteSpace: 'nowrap' }}>{component.type}</div>
        </div>
        <div className="flex gap-1 opacity-70 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(component.id); }}
            className="bg-none border-none cursor-pointer text-base text-blue-600 px-1 py-0.5"
            title="Duplicate"
          >
            ++
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirm({ componentId: component.id, componentName: getComponentTitle(component) });
            }}
            className="bg-none border-none cursor-pointer text-lg text-red-500 px-1 py-0.5"
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
