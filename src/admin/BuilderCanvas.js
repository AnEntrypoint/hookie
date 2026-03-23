import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Renderer from '../public/Renderer';
import componentRegistry from '../lib/componentRegistry';
import { generateUniqueId } from './builderHelpers';
import './admin.css';

export default function BuilderCanvas({
  pageData, selectedId, onUpdate, onSelectComponent,
  onDelete, onDuplicate,
  canUndo, canRedo, onUndo, onRedo,
  paletteVisible = true, isMobile = false, layout
}) {
  const pageBg = layout?.colors?.background || '#ffffff';
  const pageText = layout?.colors?.text || '#1e293b';
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
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-slate-200 flex-wrap builder-toolbar">
        <button onClick={onUndo} disabled={!canUndo} className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md cursor-pointer text-base text-slate-800 min-h-[44px] min-w-[44px] disabled:opacity-40 disabled:cursor-not-allowed builder-toolbar-button" title="Undo (Ctrl+Z)">
          &#8630;
        </button>
        <button onClick={onRedo} disabled={!canRedo} className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md cursor-pointer text-base text-slate-800 min-h-[44px] min-w-[44px] disabled:opacity-40 disabled:cursor-not-allowed builder-toolbar-button" title="Redo (Ctrl+Shift+Z)">
          &#8631;
        </button>
        <div className="w-px h-6 bg-slate-200 mx-2 builder-separator" />
        <select value={previewMode} onChange={(e) => setPreviewMode(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-white cursor-pointer min-h-[44px] builder-select">
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet (768px)</option>
          <option value="mobile">Mobile (375px)</option>
        </select>
      </div>

      <div
        ref={drop}
        className="flex-1 overflow-y-auto p-5 flex justify-center transition-colors duration-150 builder-canvas"
        style={{ backgroundColor: isOver ? '#f0f9ff' : pageBg }}
      >
        <div
          className="transition-[width] duration-300 min-h-[400px] builder-canvas-inner"
          style={{ width: getCanvasWidth(), backgroundColor: pageBg, color: pageText }}
        >
          {pageData && pageData.components && pageData.components.length > 0 ? (
            <Renderer pageData={pageData} mode="edit" selectedId={selectedId} onSelectComponent={onSelectComponent} onDelete={onDelete} onDuplicate={onDuplicate} />
          ) : (
            <EmptyCanvas onAddComponent={handleDropComponent} isMobileView={!paletteVisible && typeof window !== 'undefined' && window.innerWidth < 768} />
          )}
        </div>
      </div>

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
    <div className="p-12 text-center text-slate-400 text-base border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center gap-3 min-h-[400px] justify-center builder-empty-state">
      <div className="text-3xl text-slate-300 font-mono tracking-widest self-start ml-6">{isMobileView ? '\u2193 Tap below to add components' : '\u2190 Drag from left panel'}</div>
      <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">+</div>
      <h3 className="m-0 text-lg font-semibold text-slate-800">Start building your page</h3>
      <p className="m-0 text-sm text-slate-500 max-w-xs leading-relaxed">
        {isMobileView ? 'Tap the component button to browse components' : 'Drag components from the left panel onto this canvas'}
      </p>
      <div className="flex gap-2 flex-wrap justify-center mt-2">
        {quickPatterns.map(p => (
          <button key={p.type} className="flex flex-col items-center gap-1 px-4 py-3 bg-white border border-slate-200 rounded-lg cursor-pointer min-w-[80px] hover:border-blue-300" onClick={() => onAddComponent({ componentType: p.type })}>
            <span className="text-sm font-bold text-blue-600 font-mono">{p.icon}</span>
            <span className="text-xs text-slate-500 font-medium">{p.label}</span>
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
