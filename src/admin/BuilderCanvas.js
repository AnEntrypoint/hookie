import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Renderer from '../public/Renderer';
import componentRegistry from '../lib/componentRegistry';
import { generateUniqueId } from './builderHelpers';
import { styles } from './builderCanvasStyles';
import './admin.css';

export default function BuilderCanvas({
  pageData, selectedId, onUpdate, onSelectComponent,
  canUndo, canRedo, onUndo, onRedo,
  paletteVisible = true, isMobile = false
}) {
  const [previewMode, setPreviewMode] = useState('desktop');

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item) => handleDropComponent(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
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
    if (!newPageData.components) newPageData.components = [];
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
      <div style={styles.toolbar} className="builder-toolbar">
        <button onClick={onUndo} disabled={!canUndo} style={styles.toolbarButton} className="builder-toolbar-button" title="Undo (Ctrl+Z)">
          &#8630;
        </button>
        <button onClick={onRedo} disabled={!canRedo} style={styles.toolbarButton} className="builder-toolbar-button" title="Redo (Ctrl+Shift+Z)">
          &#8631;
        </button>
        <div style={styles.separator} className="builder-separator" />
        <select value={previewMode} onChange={(e) => setPreviewMode(e.target.value)} style={styles.select} className="builder-select">
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet (768px)</option>
          <option value="mobile">Mobile (375px)</option>
        </select>
      </div>

      <div ref={drop} style={{ ...styles.canvas, backgroundColor: isOver ? '#f0f9ff' : '#ffffff' }} className="builder-canvas">
        <div style={{ ...styles.canvasInner, width: getCanvasWidth() }} className="builder-canvas-inner">
          {pageData && pageData.components && pageData.components.length > 0 ? (
            <Renderer pageData={pageData} mode="edit" selectedId={selectedId} onSelectComponent={onSelectComponent} />
          ) : (
            <EmptyCanvas onAddComponent={handleDropComponent} isMobileView={!paletteVisible && typeof window !== 'undefined' && window.innerWidth < 768} />
          )}
        </div>
      </div>

      {selectedId && (
        <div style={styles.selectionInfo} className="builder-selection-info">
          <span style={styles.selectionText} className="builder-selection-text">Selected: {selectedId}</span>
          <button onClick={() => onSelectComponent(null)} style={styles.clearButton} className="builder-clear-button">Clear Selection x</button>
        </div>
      )}
    </div>
  );
}

function EmptyCanvas({ onAddComponent, isMobileView }) {
  const quickPatterns = [
    { label: 'Hero Section', type: 'Container', icon: '[ ]' },
    { label: 'Heading', type: 'Heading', icon: 'H' },
    { label: 'Text Block', type: 'Text', icon: 'T' },
    { label: 'Image', type: 'Image', icon: 'IMG' },
  ];

  return (
    <div style={styles.emptyState} className="builder-empty-state">
      <div style={styles.emptyArrow}>{isMobileView ? '' : '<--'}</div>
      <div style={styles.emptyIcon}>+</div>
      <h3 style={styles.emptyHeading}>Start building your page</h3>
      <p style={styles.emptyText}>
        {isMobileView ? 'Tap the component button to browse components' : 'Drag components from the left panel onto this canvas'}
      </p>
      <div style={styles.quickAddRow}>
        {quickPatterns.map(p => (
          <button key={p.type} style={styles.quickAddButton} onClick={() => onAddComponent({ componentType: p.type })}>
            <span style={styles.quickAddIcon}>{p.icon}</span>
            <span style={styles.quickAddLabel}>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function getDefaultProps(componentType) {
  const schema = componentRegistry.getComponent(componentType);
  if (!schema || !schema.props) return {};
  const defaults = {};
  Object.entries(schema.props).forEach(([propName, propSchema]) => {
    if (propSchema.default !== undefined) defaults[propName] = propSchema.default;
  });
  return defaults;
}
