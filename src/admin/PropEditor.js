import React from 'react';

export default function PropEditor({ prop, index, onUpdate, onRemove }) {
  const propTypes = ['string', 'number', 'boolean', 'array', 'object', 'node', 'function'];

  return (
    <div style={styles.propEditor}>
      <div style={styles.propRow}>
        <div style={styles.field}>
          <label style={styles.label}>Prop Name</label>
          <input
            type="text"
            value={prop.name || ''}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            placeholder="propName (camelCase)"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Type</label>
          <select
            value={prop.type || 'string'}
            onChange={(e) => onUpdate(index, 'type', e.target.value)}
            style={styles.select}
          >
            {propTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={styles.checkboxField}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={prop.required || false}
              onChange={(e) => onUpdate(index, 'required', e.target.checked)}
              style={styles.checkbox}
            />
            Required
          </label>
        </div>
      </div>

      <div style={styles.propRow}>
        <div style={styles.field}>
          <label style={styles.label}>Default Value</label>
          <input
            type="text"
            value={prop.default || ''}
            onChange={(e) => onUpdate(index, 'default', e.target.value)}
            placeholder={getDefaultPlaceholder(prop.type)}
            style={styles.input}
          />
        </div>

        {prop.type === 'string' && (
          <div style={styles.field}>
            <label style={styles.label}>Options (comma-separated)</label>
            <input
              type="text"
              value={prop.options || ''}
              onChange={(e) => onUpdate(index, 'options', e.target.value)}
              placeholder="option1, option2, option3"
              style={styles.input}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => onRemove(index)}
          style={styles.removeButton}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function getDefaultPlaceholder(type) {
  switch (type) {
    case 'number': return '0';
    case 'boolean': return 'true';
    case 'array': return '[]';
    case 'object': return '{}';
    default: return 'default value';
  }
}

const styles = {
  propEditor: {
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
  },
  propRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
    alignItems: 'flex-end',
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  checkboxField: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '8px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#64748b',
    marginBottom: '4px',
  },
  checkboxLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    transition: 'border 150ms ease-in-out',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  removeButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 150ms ease-in-out',
  },
};
