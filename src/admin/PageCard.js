import React, { useState } from 'react';

export default function PageCard({ page, onEdit, onDuplicate, onDelete }) {
  const [showDuplicateInput, setShowDuplicateInput] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');
  const componentCount = page.data?.components?.length ?? null;
  const previewUrl = `${window.location.origin}${window.location.pathname}#/pages/${page.name}`;

  const handleDelete = () => {
    if (window.confirm(`Delete "${page.name}"? This cannot be undone.`)) onDelete(page);
  };

  const handleDuplicateConfirm = () => {
    if (duplicateName.trim()) {
      onDuplicate(page, duplicateName.trim());
      setShowDuplicateInput(false);
      setDuplicateName('');
    }
  };

  const handleDuplicateKeyDown = (e) => {
    if (e.key === 'Enter') handleDuplicateConfirm();
    if (e.key === 'Escape') { setShowDuplicateInput(false); setDuplicateName(''); }
  };

  return (
    <div className="card bg-backgroundSecondary border border-border1 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-center h-20 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)' }}>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-black text-primary/60 tracking-tight">{formatPageName(page.name).slice(0, 2).toUpperCase()}</span>
          <span className="text-xs font-mono text-primary/40">/{page.name}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-content1 text-sm">{formatPageName(page.name)}</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-xs text-content3 font-mono">/{page.name}</span>
          {componentCount !== null && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {componentCount} {componentCount === 1 ? 'component' : 'components'}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mt-auto">
        <button onClick={() => onEdit(page)} className="btn btn-primary btn-xs flex-1">Edit</button>
        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-xs flex-1 no-underline">View</a>
        <button onClick={() => { setShowDuplicateInput(v => !v); setDuplicateName(`${page.name}-copy`); }} className="btn btn-outline btn-xs flex-1">Copy</button>
        <button onClick={handleDelete} className="btn btn-outline btn-xs flex-1 text-error border-error/30 hover:bg-error/10">Delete</button>
      </div>

      {showDuplicateInput && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={duplicateName}
            onChange={e => setDuplicateName(e.target.value)}
            onKeyDown={handleDuplicateKeyDown}
            placeholder="new-page-name"
            className="input input-bordered input-sm flex-1"
            autoFocus
          />
          <button onClick={handleDuplicateConfirm} className="btn btn-primary btn-sm">Create</button>
          <button onClick={() => { setShowDuplicateInput(false); setDuplicateName(''); }} className="btn btn-ghost btn-sm">✕</button>
        </div>
      )}
    </div>
  );
}

function formatPageName(name) {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
