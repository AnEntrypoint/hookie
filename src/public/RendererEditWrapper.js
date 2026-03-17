import React from 'react';

export default function RendererEditWrapper({ id, type, index, isSelected, isContainer, isEmpty, onSelect, onDelete, onDuplicate, children }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect(id);
  };

  return (
    <div
      key={id || index}
      className={`builder-component-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      data-component-id={id}
      data-component-type={type}
      style={{
        position: 'relative',
        outline: isSelected ? '2px solid #2563eb' : (isContainer && isEmpty ? '2px dashed #cbd5e1' : 'none'),
        backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.05)' : (isContainer && isEmpty ? 'rgba(203, 213, 225, 0.05)' : 'transparent'),
        borderRadius: '4px',
        transition: 'all 150ms ease-in-out',
        cursor: 'pointer',
        minHeight: isContainer && isEmpty ? '80px' : undefined,
      }}
    >
      {children}
      {isSelected && (
        <div style={{ position: 'absolute', top: '-32px', left: '0', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 10, pointerEvents: 'auto' }}>
          <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600', backgroundColor: '#dbeafe', padding: '2px 8px', borderRadius: '3px', whiteSpace: 'nowrap' }}>
            {type}
          </span>
          {onDuplicate && (
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(id); }}
              style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', color: '#475569', fontWeight: '600', whiteSpace: 'nowrap' }}
              title="Duplicate (Ctrl+D)"
            >Copy</button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '3px', cursor: 'pointer', color: '#991b1b', fontWeight: '600', whiteSpace: 'nowrap' }}
              title="Delete (Del)"
            >Delete</button>
          )}
        </div>
      )}
    </div>
  );
}
