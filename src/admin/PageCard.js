import React, { useState } from 'react';
import { styles } from './pageCardStyles';

export default function PageCard({ page, onEdit, onDuplicate, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDuplicateInput, setShowDuplicateInput] = useState(false);
  const [duplicateName, setDuplicateName] = useState(`${page.name}-copy`);

  const componentCount = page.data?.components?.length ?? null;
  const previewUrl = `${window.location.origin}${window.location.pathname}#/pages/${page.name}`;

  const handleDuplicateConfirm = () => {
    if (duplicateName.trim()) {
      onDuplicate(page, duplicateName.trim());
      setShowDuplicateInput(false);
    }
  };

  if (showDeleteConfirm) {
    return (
      <div style={styles.card}>
        <div style={styles.confirmDialog}>
          <p style={styles.confirmText}>Delete {page.name}? This cannot be undone.</p>
          <div style={styles.confirmActions}>
            <button onClick={() => { onDelete(page); setShowDeleteConfirm(false); }} style={styles.confirmDelete}>Delete</button>
            <button onClick={() => setShowDeleteConfirm(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (showDuplicateInput) {
    return (
      <div style={styles.card}>
        <div style={styles.confirmDialog}>
          <label style={styles.inputLabel}>New page name (URL slug):</label>
          <input type="text" value={duplicateName} onChange={(e) => setDuplicateName(e.target.value)} style={styles.inputField} autoFocus />
          <div style={styles.confirmActions}>
            <button onClick={handleDuplicateConfirm} style={styles.editButton}>Create Copy</button>
            <button onClick={() => setShowDuplicateInput(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '2rem' }}>📄</span>
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{formatPageName(page.name)}</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>/{page.name}</span>
          {componentCount !== null && (
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#2563eb', backgroundColor: '#dbeafe', padding: '2px 8px', borderRadius: '999px' }}>
              {componentCount} {componentCount === 1 ? 'component' : 'components'}
            </span>
          )}
        </div>
      </div>
      <div style={styles.actions}>
        <button onClick={() => onEdit(page)} style={styles.editButton}>Edit</button>
        <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ ...styles.duplicateButton, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>View</a>
        <button onClick={() => { setShowDuplicateInput(true); setDuplicateName(`${page.name}-copy`); }} style={styles.duplicateButton}>Copy</button>
        <button onClick={() => setShowDeleteConfirm(true)} style={styles.deleteButton}>Delete</button>
      </div>
    </div>
  );
}

function formatPageName(name) {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
