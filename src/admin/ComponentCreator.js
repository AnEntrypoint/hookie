import React, { useState } from 'react';
import PropEditor from './PropEditor';
import { validateComponentName, validatePropName, parseDefaultValue } from './validators';
import contentManager from '../lib/contentManager';
import componentRegistry from '../lib/componentRegistry';
import { styles } from './componentCreatorStyles';

export default function ComponentCreator({ owner, repo, onComponentCreated }) {
  const [componentName, setComponentName] = useState('');
  const [description, setDescription] = useState('');
  const [props, setProps] = useState([]);
  const [allowedChildren, setAllowedChildren] = useState('all');
  const [specificChildren, setSpecificChildren] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const addProp = () => {
    setProps([...props, { name: '', type: 'string', required: false, default: '', options: null }]);
  };

  const removeProp = (index) => {
    setProps(props.filter((_, i) => i !== index));
  };

  const updateProp = (index, field, value) => {
    const updated = [...props];
    updated[index] = { ...updated[index], [field]: value };
    setProps(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const existingComponents = Object.keys(componentRegistry.getAllComponents());
    const nameValidation = validateComponentName(componentName, existingComponents);
    if (!nameValidation.valid) {
      setError(nameValidation.error);
      return;
    }

    const propNames = props.map(p => p.name).filter(Boolean);
    for (const prop of props) {
      if (prop.name) {
        const otherProps = propNames.filter(n => n !== prop.name);
        const propValidation = validatePropName(prop.name, otherProps);
        if (!propValidation.valid) {
          setError(`Prop "${prop.name}": ${propValidation.error}`);
          return;
        }
      }
    }

    const schema = {
      name: componentName,
      description: description || '',
      props: {},
      allowedChildren: allowedChildren === 'all' ? ['*'] : allowedChildren === 'none' ? [] : specificChildren,
      defaultStyle: {}
    };

    props.forEach(prop => {
      if (prop.name) {
        schema.props[prop.name] = {
          type: prop.type || 'string',
          required: prop.required || false,
          default: parseDefaultValue(prop.default, prop.type)
        };
        
        if (prop.options && prop.type === 'string') {
          schema.props[prop.name].options = prop.options.split(',').map(o => o.trim()).filter(Boolean);
        }
      }
    });

    setSaving(true);
    try {
      await contentManager.saveComponentSchema(owner, repo, componentName, schema);
      componentRegistry.registerComponent(componentName, schema);
      if (onComponentCreated) {
        onComponentCreated(componentName);
      }
      handleReset();
    } catch (err) {
      setError(err.message || 'Failed to create component');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setComponentName('');
    setDescription('');
    setProps([]);
    setAllowedChildren('all');
    setSpecificChildren([]);
    setError(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Custom Component</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <section style={styles.section}>
          <h3 style={styles.sectionHeading}>Component Info</h3>
          
          <div style={styles.field}>
            <label style={styles.label}>Component Name (PascalCase)</label>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="MyComponent"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
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
          <h3 style={styles.sectionHeading}>Props</h3>
          
          {props.map((prop, index) => (
            <PropEditor
              key={index}
              prop={prop}
              index={index}
              onUpdate={updateProp}
              onRemove={removeProp}
            />
          ))}

          <button type="button" onClick={addProp} style={styles.addButton}>
            + Add Prop
          </button>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionHeading}>Children Rules</h3>
          
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

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.actions}>
          <button type="submit" disabled={saving} style={styles.submitButton}>
            {saving ? 'Creating...' : 'Create Component'}
          </button>
          <button type="button" onClick={handleReset} style={styles.resetButton}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
