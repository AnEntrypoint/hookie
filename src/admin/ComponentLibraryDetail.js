import React from 'react';
import PropInput from './PropInput.js';
import { styles } from './componentLibraryStyles.js';
import { componentLoader } from '../lib/componentLoader.js';

export default function ComponentLibraryDetail({ component, pageUsage, previewProps, onPropChange, onDelete, deleteConfirm, onDeleteConfirm, onDeleteCancel, isMobile, onBack }) {
  if (!component) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '32px', textAlign: 'center' }}>
        Select a component from the list to view details and preview it live.
      </div>
    );
  }

  const renderPreview = () => {
    const Comp = componentLoader.getComponentImplementation(component.name);
    if (!Comp) return <div style={styles.previewError}>Component implementation not found</div>;
    try {
      return (
        <div style={styles.previewArea}>
          <div style={styles.previewContent}><Comp {...previewProps} /></div>
        </div>
      );
    } catch (err) {
      return <div style={styles.previewError}>Error rendering: {err.message}</div>;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflowY: 'auto' }}>
      {isMobile && onBack && (
        <button onClick={onBack} style={styles.backButton}>Back to List</button>
      )}

      <div style={styles.detailHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <span style={{ fontSize: '1.5rem' }}>{component.icon || '□'}</span>
          <h2 style={styles.detailTitle}>{component.name}</h2>
          {component.category && (
            <span style={{ fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap' }}>{component.category}</span>
          )}
        </div>
        {component.isCustom && (
          <button onClick={() => onDeleteConfirm(component.name)} style={styles.deleteButton}>Delete</button>
        )}
      </div>

      {deleteConfirm === component.name && (
        <div style={styles.confirmDialog}>
          <p style={{ margin: '0 0 8px' }}>Delete {component.name}? This cannot be undone.</p>
          <div style={styles.confirmActions}>
            <button onClick={() => onDelete(component.name)} style={styles.confirmDeleteBtn}>Delete</button>
            <button onClick={onDeleteCancel} style={styles.confirmCancelBtn}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Description</h3>
          <p style={styles.sectionText}>{component.description || 'No description provided'}</p>
        </div>

        {pageUsage[component.name]?.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Used in Pages</h3>
            <ul style={styles.usageList}>
              {pageUsage[component.name].map(page => (
                <li key={page} style={styles.usageItem}>{page}</li>
              ))}
            </ul>
          </div>
        )}

        {component.allowedChildren && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Allowed Children</h3>
            <p style={styles.sectionText}>
              {component.allowedChildren.includes('*') ? 'Any component' : component.allowedChildren.join(', ')}
            </p>
          </div>
        )}

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Properties</h3>
          {Object.keys(component.props || {}).length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {Object.entries(component.props || {}).map(([propName, propSchema]) => (
                <div key={propName} style={styles.propField}>
                  <label style={styles.propLabel}>
                    {propName}
                    <span style={styles.propType}>({propSchema?.type || 'unknown'})</span>
                  </label>
                  <PropInput
                    propName={propName}
                    propSchema={propSchema}
                    value={previewProps[propName] !== undefined ? previewProps[propName] : (propSchema?.default ?? '')}
                    onChange={onPropChange(propName, propSchema)}
                  />
                  {propSchema?.default !== undefined && (
                    <span style={styles.defaultValue}>Default: {JSON.stringify(propSchema.default)}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.sectionText}>No props available</p>
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Live Preview</h3>
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}
