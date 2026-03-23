import React from 'react';
import PropInput from './PropInput.js';
import { componentLoader } from '../lib/componentLoader.js';

export default function ComponentLibraryDetail({ component, pageUsage, previewProps, onPropChange, onDelete, deleteConfirm, onDeleteConfirm, onDeleteCancel, isMobile, onBack }) {
  if (!component) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm p-8 text-center">
        Select a component from the list to view details and preview it live.
      </div>
    );
  }

  const renderPreview = () => {
    const Comp = componentLoader.getComponentImplementation(component.name);
    if (!Comp) return <div className="text-red-500 text-sm p-4">Component implementation not found</div>;
    try {
      return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4"><Comp {...previewProps} /></div>
        </div>
      );
    } catch (err) {
      return <div className="text-red-500 text-sm p-4">Error rendering: {err.message}</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      {isMobile && onBack && (
        <button onClick={onBack} className="btn btn-ghost btn-sm m-4 self-start">Back to List</button>
      )}

      <div className="flex items-center justify-between p-6 border-b border-slate-100 gap-3">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <span style={{ fontSize: '1.5rem' }}>{component.icon || '□'}</span>
          <h2 className="text-xl font-bold text-slate-900 m-0">{component.name}</h2>
          {component.category && (
            <span className="badge badge-ghost badge-sm whitespace-nowrap">{component.category}</span>
          )}
        </div>
        {component.isCustom && (
          <button onClick={() => onDeleteConfirm(component.name)} className="btn btn-error btn-sm btn-outline shrink-0">Delete</button>
        )}
      </div>

      {deleteConfirm === component.name && (
        <div className="mx-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p style={{ margin: '0 0 8px' }}>Delete {component.name}? This cannot be undone.</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => onDelete(component.name)} className="btn btn-error btn-sm">Delete</button>
            <button onClick={onDeleteCancel} className="btn btn-ghost btn-sm">Cancel</button>
          </div>
        </div>
      )}

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-slate-700 m-0">Description</h3>
          <p className="text-sm text-slate-600 m-0 leading-relaxed">{component.description || 'No description provided'}</p>
        </div>

        {pageUsage[component.name]?.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-700 m-0">Used in Pages</h3>
            <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
              {pageUsage[component.name].map(page => (
                <li key={page} className="badge badge-outline badge-sm">{page}</li>
              ))}
            </ul>
          </div>
        )}

        {component.allowedChildren && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-700 m-0">Allowed Children</h3>
            <p className="text-sm text-slate-600 m-0 leading-relaxed">
              {component.allowedChildren.includes('*') ? 'Any component' : component.allowedChildren.join(', ')}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-slate-700 m-0">Properties</h3>
          {Object.keys(component.props || {}).length > 0 ? (
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              {Object.entries(component.props || {}).map(([propName, propSchema]) => (
                <div key={propName} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">
                    {propName}
                    <span className="text-slate-400 font-normal ml-1">({propSchema?.type || 'unknown'})</span>
                  </label>
                  <PropInput
                    propName={propName}
                    propSchema={propSchema}
                    value={previewProps[propName] !== undefined ? previewProps[propName] : (propSchema?.default ?? '')}
                    onChange={onPropChange(propName, propSchema)}
                  />
                  {propSchema?.default !== undefined && (
                    <span className="text-[0.688rem] text-slate-400">Default: {JSON.stringify(propSchema.default)}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 m-0 leading-relaxed">No props available</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-slate-700 m-0">Live Preview</h3>
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}
