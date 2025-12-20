import React, { useState } from 'react';
import { contentManager } from '../lib/contentManager.js';
import { componentRegistry } from '../lib/componentRegistry.js';

const ComponentCreator = ({ owner, repo, onComponentCreated }) => {
  const [componentName, setComponentName] = useState('');
  const [description, setDescription] = useState('');
  const [props, setProps] = useState([]);
  const [allowedChildren, setAllowedChildren] = useState('all');
  const [specificChildren, setSpecificChildren] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const addProp = () => {
    setProps([
      ...props,
      { name: '', type: 'string', required: false, default: '', options: null }
    ]);
  };

  const removeProp = (index) => {
    setProps(props.filter((_, i) => i !== index));
  };

  const updateProp = (index, field, value) => {
    const updated = [...props];
    updated[index][field] = value;
    setProps(updated);
  };

  const parseDefaultValue = (value, type) => {
    if (!value) return undefined;

    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true' || value === true;
      case 'array':
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      case 'object':
        try {
          return JSON.parse(value);
        } catch {
          return {};
        }
      default:
        return value;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!componentName.trim()) {
      setError('Component name is required');
      return;
    }

    if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
      setError('Component name must be PascalCase (e.g., MyComponent)');
      return;
    }

    // Build schema
    const schema = {
      name: componentName,
      description: description,
      props: {},
      allowedChildren: allowedChildren === 'all' ? ['*'] :
                       allowedChildren === 'none' ? [] :
                       specificChildren,
      defaultStyle: {}
    };

    // Convert props array to props object
    props.forEach(prop => {
      if (prop.name) {
        schema.props[prop.name] = {
          type: prop.type,
          required: prop.required,
          default: parseDefaultValue(prop.default, prop.type)
        };

        if (prop.options && prop.options.length > 0) {
          schema.props[prop.name].options = prop.options;
        }
      }
    });

    setSaving(true);
    try {
      // Save to GitHub
      await contentManager.saveComponentSchema(
        owner,
        repo,
        componentName,
        schema,
        `Create custom component: ${componentName}`
      );

      // Register in local registry
      componentRegistry.registerComponent(componentName, schema);

      // Notify parent
      onComponentCreated(componentName);

      // Reset form
      handleReset();
    } catch (err) {
      setError(err.message);
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

  // Get available component types from registry
  const availableComponents = componentRegistry.getAllComponents ?
    componentRegistry.getAllComponents() : [];

  return (
    <div className="component-creator">
      <h2>Create Custom Component</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Component Info</h3>

          <div className="form-field">
            <label>Component Name *</label>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="MyCustomComponent"
              required
            />
            <span className="hint">PascalCase, e.g., CustomButton</span>
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this component does..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Props</h3>

          {props.map((prop, index) => (
            <div key={index} className="prop-editor">
              <input
                type="text"
                placeholder="propName"
                value={prop.name}
                onChange={(e) => updateProp(index, 'name', e.target.value)}
              />

              <select
                value={prop.type}
                onChange={(e) => updateProp(index, 'type', e.target.value)}
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="array">Array</option>
                <option value="object">Object</option>
                <option value="node">Node (children)</option>
                <option value="function">Function</option>
              </select>

              <label>
                <input
                  type="checkbox"
                  checked={prop.required}
                  onChange={(e) => updateProp(index, 'required', e.target.checked)}
                />
                Required
              </label>

              <input
                type="text"
                placeholder="Default value"
                value={prop.default}
                onChange={(e) => updateProp(index, 'default', e.target.value)}
              />

              {prop.type === 'string' && (
                <input
                  type="text"
                  placeholder="Options (comma-separated)"
                  value={prop.options ? prop.options.join(', ') : ''}
                  onChange={(e) => updateProp(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                />
              )}

              <button type="button" onClick={() => removeProp(index)}>
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addProp}>
            + Add Prop
          </button>
        </div>

        <div className="form-section">
          <h3>Children Rules</h3>

          <label>
            <input
              type="radio"
              name="childrenRule"
              value="all"
              checked={allowedChildren === 'all'}
              onChange={(e) => setAllowedChildren('all')}
            />
            Allow all child types
          </label>

          <label>
            <input
              type="radio"
              name="childrenRule"
              value="none"
              checked={allowedChildren === 'none'}
              onChange={(e) => setAllowedChildren('none')}
            />
            No children allowed
          </label>

          <label>
            <input
              type="radio"
              name="childrenRule"
              value="specific"
              checked={allowedChildren === 'specific'}
              onChange={(e) => setAllowedChildren('specific')}
            />
            Specific children only
          </label>

          {allowedChildren === 'specific' && (
            <div className="specific-children">
              <select
                multiple
                value={specificChildren}
                onChange={(e) => setSpecificChildren(Array.from(e.target.selectedOptions, opt => opt.value))}
              >
                {availableComponents.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Creating...' : 'Create Component'}
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComponentCreator;
