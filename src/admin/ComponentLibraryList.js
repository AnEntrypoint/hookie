import React from 'react';

export default function ComponentLibraryList({ components, selectedComponent, onSelect, searchQuery, onSearchChange, filterType, onFilterChange, isMobile }) {
  return (
    <div className="bg-white overflow-y-auto flex flex-col h-full">
      <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-slate-200 flex flex-col gap-2`}>
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input input-bordered w-full box-border"
        />
        <select value={filterType} onChange={(e) => onFilterChange(e.target.value)} className="select select-bordered w-full">
          <option value="all">All Components</option>
          <option value="builtin">Built-in Only</option>
          <option value="custom">Custom Only</option>
        </select>
      </div>

      <div className="flex flex-col overflow-y-auto">
        {components.length === 0 && (
          <div className="p-6 text-center text-slate-400 text-sm">
            No components match your search
          </div>
        )}
        {components.map((comp) => (
          <div
            key={comp.name}
            onClick={() => onSelect(comp)}
            className={`p-4 cursor-pointer border-b border-slate-100 transition-colors ${selectedComponent?.name === comp.name ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: '1.25rem' }}>{comp.icon || '□'}</span>
              <h3 className="text-sm font-semibold text-slate-800 m-0 flex-1">{comp.name}</h3>
              {comp.isCustom && <span className="badge badge-primary badge-sm">Custom</span>}
            </div>
            <p className="text-xs text-slate-500 m-0 leading-relaxed">{comp.description || 'No description'}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400">{Object.keys(comp.props || {}).length} props</span>
              {comp.category && <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{comp.category}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
