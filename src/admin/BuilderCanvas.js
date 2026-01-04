import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Renderer from '../public/Renderer';
import componentRegistry from '../lib/componentRegistry';
import { generateUniqueId } from './builderHelpers';
import { breakpoints, minTouchSize } from './responsiveStyles';

export default function BuilderCanvas({
  pageData,
  selectedId,
  onUpdate,
  onSelectComponent,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  paletteVisible = true,
  isMobile = false
}) {
  const [previewMode, setPreviewMode] = useState('desktop');

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item) => handleDropComponent(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

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


  const getCanvasWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          style={styles.toolbarButton}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          style={styles.toolbarButton}
          title="Redo (Ctrl+Shift+Z)"
        >
          ↷
        </button>
        <div style={styles.separator} />
        <select
          value={previewMode}
          onChange={(e) => setPreviewMode(e.target.value)}
          style={styles.select}
        >
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet (768px)</option>
          <option value="mobile">Mobile (375px)</option>
        </select>
      </div>

      <div
        ref={drop}
        style={{
          ...styles.canvas,
          backgroundColor: isOver ? '#f0f9ff' : '#ffffff',
        }}
      >
        <div style={{ ...styles.canvasInner, width: getCanvasWidth() }}>
          {pageData && pageData.components ? (
            <Renderer
              pageData={pageData}
              mode="edit"
              selectedId={selectedId}
              onSelectComponent={onSelectComponent}
            />
          ) : (
            <div style={styles.emptyState}>
              Drop components here to start building
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}

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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#f8fafc',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      padding: '8px 12px',
      gap: '6px',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      padding: '6px 8px',
      gap: '4px',
    },
  },
  toolbarButton: {
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#1e293b',
    ...minTouchSize,
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      padding: '6px 10px',
      fontSize: '0.875rem',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      padding: '4px 8px',
      fontSize: '0.75rem',
    },
  },
  separator: {
    width: '1px',
    height: '24px',
    backgroundColor: '#e2e8f0',
    margin: '0 8px',
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      display: 'none',
    },
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    ...minTouchSize,
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      padding: '6px 10px',
      fontSize: '0.8125rem',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      padding: '4px 8px',
      fontSize: '0.75rem',
    },
  },
  canvas: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    transition: 'background-color 150ms',
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      padding: '12px',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      padding: '8px',
    },
  },
  canvasInner: {
    transition: 'width 300ms',
    minHeight: '400px',
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      minHeight: '300px',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      minHeight: '250px',
    },
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '1rem',
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      padding: '32px 16px',
      fontSize: '0.875rem',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      padding: '24px 12px',
      fontSize: '0.75rem',
    },
  },
  selectionInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#dbeafe',
    borderTop: '1px solid #93c5fd',
    gap: '12px',
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      padding: '10px 12px',
      gap: '8px',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      padding: '8px 8px',
      gap: '6px',
      flexWrap: 'wrap',
    },
  },
  selectionText: {
    fontSize: '0.875rem',
    color: '#1e40af',
    fontWeight: '500',
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      fontSize: '0.75rem',
    },
  },
  clearButton: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#1e40af',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    ...minTouchSize,
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      fontSize: '0.75rem',
      padding: '4px 8px',
    },
  },
};
