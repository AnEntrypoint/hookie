import React, { useState, useEffect } from 'react';
import componentRegistry from '../lib/componentRegistry';
import * as componentManager from '../lib/componentManager';
import componentLoader from '../lib/componentLoader';

export default function ComponentManager({ owner, repo, onEdit }) {
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadComponents();
  }, [owner, repo]);

  const loadComponents = async () => {
    try {
      const allComponentNames = componentRegistry.getAllComponents();
      const customComponents = allComponentNames
        .map(name => componentRegistry.getComponent(name))
        .filter(schema => componentLoader.getComponentImplementation(schema.name));
      setComponents(customComponents);
      setError(null);
    } catch (err) {
      setError('Failed to load components');
      console.error(err);
    }
  };

  const handleDelete = async (componentName) => {
    try {
      await componentManager.deleteComponentSchema(owner, repo, componentName);
      await componentManager.deleteComponentImplementation?.(owner, repo, componentName);
      componentLoader._implementations.delete(componentName);
      setComponents(components.filter(c => c.name !== componentName));
      setDeleteConfirm(null);
    } catch (err) {
      setError(`Failed to delete ${componentName}`);
      console.error(err);
    }
  };

  const filteredComponents = components.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Custom Components</h2>
        <input
          type="text"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {filteredComponents.length === 0 ? (
        <div style={styles.empty}>
          <p>No custom components yet</p>
          <p style={styles.emptySmall}>Create components in the Components section</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredComponents.map(comp => (
            <div key={comp.name} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.componentName}>{comp.name}</h3>
              </div>
              {comp.description && (
                <p style={styles.description}>{comp.description}</p>
              )}
              <div style={styles.cardFooter}>
                <button
                  onClick={() => onEdit(comp)}
                  style={styles.editButton}
                  title="Edit component"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(comp.name)}
                  style={styles.deleteButton}
                  title="Delete component"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Delete Component?</h3>
            <p style={styles.modalMessage}>
              Are you sure you want to delete <strong>{deleteConfirm}</strong>? This cannot be undone.
            </p>
            <div style={styles.modalButtons}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={styles.confirmDeleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' },
  searchInput: { width: '100%', maxWidth: '300px', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' },
  error: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  empty: { textAlign: 'center', padding: '48px 24px', color: '#6b7280' },
  emptySmall: { fontSize: '14px', margin: '8px 0 0 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', transition: 'all 200ms' },
  cardHeader: { marginBottom: '12px' },
  componentName: { fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0' },
  description: { fontSize: '14px', color: '#6b7280', margin: '8px 0' },
  cardFooter: { display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' },
  editButton: { flex: 1, padding: '8px 12px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  deleteButton: { flex: 1, padding: '8px 12px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', maxWidth: '400px', width: '90%' },
  modalTitle: { fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' },
  modalMessage: { fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0', lineHeight: '1.5' },
  modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelButton: { padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#1f2937', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  confirmDeleteButton: { padding: '8px 16px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
};
