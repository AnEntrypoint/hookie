import React from 'react';
import PropsEditor from './PropsEditor.js';
import componentRegistry from '../lib/componentRegistry.js';
import { deepClone, findComponentById } from './builderHelpers.js';

export default function BuilderPropsPanel({ pageData, selectedComponentId, onUpdate, isMobile, isTablet, onShowMobileProps }) {
  const component = selectedComponentId ? findComponentById(pageData, selectedComponentId) : null;
  const schema = component ? componentRegistry.getComponent(component.type) : null;

  const handleChange = (updatedProps) => {
    const newPageData = deepClone(pageData);
    const comp = findComponentById(newPageData, selectedComponentId);
    if (comp) { comp.props = updatedProps; onUpdate(newPageData); }
  };

  const panelCls = isMobile
    ? 'hidden'
    : isTablet
    ? 'w-full border-t border-slate-200 max-h-[200px] p-3 bg-white overflow-y-auto'
    : 'w-1/4 min-w-[300px] border-l border-slate-200 p-4 bg-white overflow-y-auto';

  if (!selectedComponentId) {
    return (
      <div className={panelCls}>
        <div className="p-6 text-center text-slate-400">
          <div className="text-2xl mb-3">←</div>
          <div className="text-sm font-semibold text-slate-500 mb-1">No component selected</div>
          <div className="text-xs leading-relaxed">Click a component on the canvas to edit its properties here</div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={panelCls}>
        <button onClick={onShowMobileProps} className="btn btn-primary w-full">Edit Properties</button>
      </div>
    );
  }

  return (
    <div className={panelCls}>
      <PropsEditor component={component} schema={schema} onChange={handleChange} isMobile={false} />
    </div>
  );
}
