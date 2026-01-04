import React from 'react';
import PropEditor from './PropEditor';
import CodeEditor from './CodeEditor';
import { styles } from './componentCreatorStyles';
import './admin.css';

export default function ComponentCreatorForm({
  componentName, setComponentName, nameErrors,
  description, setDescription,
  componentCode, setComponentCode,
  props, addProp, removeProp, updateProp,
  allowedChildren, setAllowedChildren,
  specificChildren, setSpecificChildren,
  error, saving, isEditMode,
  onSubmit, onReset
}) {
  return (
    <div style={styles.container} className="creator-container">
      <h2 style={styles.heading} className="creator-heading">{isEditMode ? `Edit ${componentName}` : 'Create Custom Component'}</h2>

      <form onSubmit={onSubmit} style={styles.form}>
        <section style={styles.section}>
          <h3 style={styles.sectionHeading} className="creator-section-heading">Component Info</h3>

          <div style={styles.field}>
            <label style={styles.label}>Component Name</label>
            <div style={styles.helperText}>PascalCase name (e.g., MyButton, CustomCard)</div>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="MyComponent"
              style={styles.input}
              disabled={isEditMode}
            />

            {componentName && nameErrors.length === 0 && (
              <div style={{color: '#10b981', fontSize: '0.75rem', marginTop: '6px', fontWeight: '500'}}>✓ Valid</div>
            )}

            {nameErrors.length > 0 && (
              <div style={{color: '#ef4444', fontSize: '0.75rem', marginTop: '6px', fontWeight: '500'}}>
                {nameErrors.map((err, idx) => <div key={idx}>✗ {err}</div>)}
              </div>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <div style={styles.helperText}>Brief description of what this component does</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this component does..."
              rows={3}
              style={styles.textarea}
            />
          </div>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionHeading} className="creator-section-heading">Props</h3>
          <div style={styles.helperText}>Define the properties users can pass to this component</div>

          {props.map((prop, index) => (
            <PropEditor
              key={index}
              prop={prop}
              index={index}
              onUpdate={updateProp}
              onRemove={removeProp}
              props={props}
            />
          ))}

          <button type="button" onClick={addProp} style={styles.addButton}>
            + Add Prop
          </button>
        </section>

        <CodeEditor
          value={componentCode}
          onChange={setComponentCode}
          componentName={componentName}
        />

        <section style={styles.section}>
          <h3 style={styles.sectionHeading} className="creator-section-heading">Children Rules</h3>

          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="all"
                checked={allowedChildren === 'all'}
                onChange={(e) => setAllowedChildren(e.target.value)}
                style={styles.radio}
              />
              Allow all child types
            </label>

            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="none"
                checked={allowedChildren === 'none'}
                onChange={(e) => setAllowedChildren(e.target.value)}
                style={styles.radio}
              />
              No children allowed
            </label>

            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="specific"
                checked={allowedChildren === 'specific'}
                onChange={(e) => setAllowedChildren(e.target.value)}
                style={styles.radio}
              />
              Specific children only
            </label>
          </div>
        </section>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.actions} className="creator-actions">
          <button type="submit" disabled={saving} style={styles.submitButton}>
            {saving ? 'Saving...' : (isEditMode ? 'Update Component' : 'Create Component')}
          </button>
          <button type="button" onClick={onReset} style={styles.resetButton}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
