import React, { useState } from 'react';
import { styles } from './pageCardStyles';

export default function PageCard({ page, onEdit, onDuplicate, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDuplicateInput, setShowDuplicateInput] = useState(false);
  const [duplicateName, setDuplicateName] = useState(`${page.name}-copy`);

  const handleEdit = () => {
    onEdit(page);
  };

  const handleDuplicateClick = () => {
    setShowDuplicateInput(true);
    setDuplicateName(`${page.name}-copy`);
  };

  const handleDuplicateConfirm = () => {
    if (duplicateName.trim()) {
      onDuplicate(page, duplicateName.trim());
      setShowDuplicateInput(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(page);
    setShowDeleteConfirm(false);
  };

  if (showDeleteConfirm) {
    return (
      <div style={styles.card}>
        <div style={styles.confirmDialog}>
          <p style={styles.confirmText}>Are you sure you want to delete "{page.name}"? This cannot be undone.</p>
          <div style={styles.confirmActions}>
            <button onClick={handleDeleteConfirm} style={styles.confirmDelete}>Delete</button>
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
          <label style={styles.inputLabel}>Enter name for duplicated page:</label>
          <input
            type="text"
            value={duplicateName}
            onChange={(e) => setDuplicateName(e.target.value)}
            style={styles.inputField}
            autoFocus
          />
          <div style={styles.confirmActions}>
            <button onClick={handleDuplicateConfirm} style={styles.editButton}>Duplicate</button>
            <button onClick={() => setShowDuplicateInput(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.preview}>
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      <div style={styles.info}>
        <h3 style={styles.title}>{formatPageName(page.name)}</h3>
        {page.modified && (
          <p style={styles.meta}>Modified {formatDate(page.modified)}</p>
        )}
      </div>

      <div style={styles.actions}>
        <button onClick={handleEdit} style={styles.editButton}>
          Edit
        </button>
        <button onClick={handleDuplicateClick} style={styles.duplicateButton}>
          Duplicate
        </button>
        <button onClick={handleDeleteClick} style={styles.deleteButton}>
          Delete
        </button>
      </div>
    </div>
  );
}

function formatPageName(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
