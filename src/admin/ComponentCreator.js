import React, { useState, useEffect, useRef } from 'react';
import { contentManager } from '../lib/contentManager.js';
import { componentRegistry } from '../lib/componentRegistry.js';

const easeOut = 'cubic-bezier(0.4, 0, 0.2, 1)';

const parseDefaultValue = (value, type) => {
  if (!value && value !== 0 && value !== false) return undefined;

  switch (type) {
    case 'number':
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value === 'true' || value === '1';
      return Boolean(value);
    case 'array':
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    case 'object':
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch {
          return {};
        }
      }
      return {};
    default:
      return value;
  }
};

const validatePascalCase = (name) => /^[A-Z][a-zA-Z0-9]*$/.test(name);

const validateCamelCase = (name) => /^[a-z][a-zA-Z0-9]*$/.test(name);

const ComponentCreator = ({ owner, repo, onComponentCreated }) => {
  const [componentName, setComponentName] = useState('');
  const [description, setDescription] = useState('');
  const [props, setProps] = useState([]);
  const [allowedChildren, setAllowedChildren] = useState('all');
  const [specificChildren, setSpecificChildren] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [availableComponents, setAvailableComponents] = useState([]);
  const nameInputRef = useRef(null);

  useEffect(() => {
    const components = Object.keys(componentRegistry.registry || {});
    setAvailableComponents(components);
    
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

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

  const handleReset = () => {
    setComponentName('');
    setDescription('');
    setProps([]);
    setAllowedChildren('all');
    setSpecificChildren([]);
    setError(null);
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!componentName.trim()) {
      setError('Component name is required');
      return;
    }

    if (!validatePascalCase(componentName)) {
      setError('Component name must be PascalCase (e.g., MyComponent)');
      return;
    }

    if (componentRegistry.registry && componentRegistry.registry[componentName]) {
      setError(`Component "${componentName}" already exists`);
      return;
    }

    const propNames = new Set();
    for (const prop of props) {
      if (prop.name) {
        if (!validateCamelCase(prop.name)) {
          setError(`Prop "${prop.name}" must be camelCase`);
          return;
        }
        if (propNames.has(prop.name)) {
          setError(`Duplicate prop name: "${prop.name}"`);
          return;
        }
        propNames.add(prop.name);
      }
    }

    const schema = {
      name: componentName,
      description: description,
      props: {},
      allowedChildren: allowedChildren === 'all' ? ['*'] :
                       allowedChildren === 'none' ? [] :
                       specificChildren,
      defaultStyle: {}
    };

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
      await contentManager.saveComponentSchema(
        owner,
        repo,
        componentName,
        schema,
        `Create custom component: ${componentName}`
      );

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

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 28px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '32px 28px',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#1e293b',
            margin: 0,
            letterSpacing: '-0.5px',
            textShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}>
            Create Custom Component
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px 28px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: '0 0 20px 0',
              letterSpacing: '-0.2px',
            }}>
              Component Info
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '8px',
              }}>
                Component Name *
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder="MyCustomComponent"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '0.875rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  transition: `all 150ms ${easeOut}`,
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <span style={{
                display: 'block',
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '6px',
              }}>
                PascalCase, e.g., CustomButton
              </span>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '8px',
              }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this component does..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '0.875rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  minHeight: '100px',
                  resize: 'vertical',
                  transition: `all 150ms ${easeOut}`,
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: '0 0 20px 0',
              letterSpacing: '-0.2px',
            }}>
              Props
            </h3>

            {props.length === 0 ? (
              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                fontSize: '0.875rem',
                marginBottom: '16px',
              }}>
                No props defined yet. Click "Add Prop" to create custom props.
              </div>
            ) : (
              props.map((prop, index) => (
                <div key={index} style={{
                  marginBottom: '16px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  transition: `all 150ms ${easeOut}`,
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                    marginBottom: '12px',
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        Prop Name
                      </label>
                      <input
                        type="text"
                        placeholder="propName"
                        value={prop.name}
                        onChange={(e) => updateProp(index, 'name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: '0.875rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontFamily: 'inherit',
                          transition: `all 150ms ${easeOut}`,
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2563eb';
                          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        Type
                      </label>
                      <select
                        value={prop.type}
                        onChange={(e) => updateProp(index, 'type', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: '0.875rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontFamily: 'inherit',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          transition: `all 150ms ${easeOut}`,
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2563eb';
                          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="array">Array</option>
                        <option value="object">Object</option>
                        <option value="node">Node (children)</option>
                        <option value="function">Function</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        Default Value
                      </label>
                      <input
                        type="text"
                        placeholder="default"
                        value={prop.default}
                        onChange={(e) => updateProp(index, 'default', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: '0.875rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontFamily: 'inherit',
                          transition: `all 150ms ${easeOut}`,
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2563eb';
                          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                    alignItems: 'flex-end',
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}>
                      <input
                        type="checkbox"
                        checked={prop.required}
                        onChange={(e) => updateProp(index, 'required', e.target.checked)}
                        style={{
                          marginRight: '8px',
                          cursor: 'pointer',
                          width: '16px',
                          height: '16px',
                          accentColor: '#2563eb',
                        }}
                      />
                      Required
                    </label>

                    {prop.type === 'string' && (
                      <input
                        type="text"
                        placeholder="Options (comma-separated)"
                        value={prop.options ? prop.options.join(', ') : ''}
                        onChange={(e) => updateProp(index, 'options', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: '0.875rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontFamily: 'inherit',
                          transition: `all 150ms ${easeOut}`,
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2563eb';
                          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => removeProp(index)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#ef4444',
                        backgroundColor: 'transparent',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: `all 150ms ease-in-out`,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#fee2e2';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}

            <button
              type="button"
              onClick={addProp}
              style={{
                padding: '10px 16px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#2563eb',
                backgroundColor: '#dbeafe',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: `all 150ms ease-in-out`,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#bfdbfe';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dbeafe';
              }}
            >
              + Add Prop
            </button>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: '0 0 20px 0',
              letterSpacing: '-0.2px',
            }}>
              Children Rules
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: '#1e293b',
                cursor: 'pointer',
                userSelect: 'none',
                padding: '12px',
                backgroundColor: allowedChildren === 'all' ? '#dbeafe' : 'transparent',
                border: `1px solid ${allowedChildren === 'all' ? '#bfdbfe' : '#e2e8f0'}`,
                borderRadius: '8px',
                transition: `all 150ms ${easeOut}`,
              }}>
                <input
                  type="radio"
                  name="childrenRule"
                  value="all"
                  checked={allowedChildren === 'all'}
                  onChange={() => setAllowedChildren('all')}
                  style={{
                    marginRight: '8px',
                    cursor: 'pointer',
                    width: '16px',
                    height: '16px',
                    accentColor: '#2563eb',
                  }}
                />
                Allow all child types
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: '#1e293b',
                cursor: 'pointer',
                userSelect: 'none',
                padding: '12px',
                backgroundColor: allowedChildren === 'none' ? '#dbeafe' : 'transparent',
                border: `1px solid ${allowedChildren === 'none' ? '#bfdbfe' : '#e2e8f0'}`,
                borderRadius: '8px',
                transition: `all 150ms ${easeOut}`,
              }}>
                <input
                  type="radio"
                  name="childrenRule"
                  value="none"
                  checked={allowedChildren === 'none'}
                  onChange={() => setAllowedChildren('none')}
                  style={{
                    marginRight: '8px',
                    cursor: 'pointer',
                    width: '16px',
                    height: '16px',
                    accentColor: '#2563eb',
                  }}
                />
                No children allowed
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: '#1e293b',
                cursor: 'pointer',
                userSelect: 'none',
                padding: '12px',
                backgroundColor: allowedChildren === 'specific' ? '#dbeafe' : 'transparent',
                border: `1px solid ${allowedChildren === 'specific' ? '#bfdbfe' : '#e2e8f0'}`,
                borderRadius: '8px',
                transition: `all 150ms ${easeOut}`,
              }}>
                <input
                  type="radio"
                  name="childrenRule"
                  value="specific"
                  checked={allowedChildren === 'specific'}
                  onChange={() => setAllowedChildren('specific')}
                  style={{
                    marginRight: '8px',
                    cursor: 'pointer',
                    width: '16px',
                    height: '16px',
                    accentColor: '#2563eb',
                  }}
                />
                Specific children only
              </label>
            </div>

            {allowedChildren === 'specific' && (
              <div style={{ marginTop: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '8px',
                }}>
                  Select Allowed Components
                </label>
                <select
                  multiple
                  value={specificChildren}
                  onChange={(e) => setSpecificChildren(Array.from(e.target.selectedOptions, opt => opt.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '0.875rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                    backgroundColor: '#ffffff',
                    minHeight: '120px',
                    transition: `all 150ms ${easeOut}`,
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {availableComponents.map(comp => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
                <span style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  marginTop: '6px',
                }}>
                  Hold Ctrl/Cmd to select multiple components
                </span>
              </div>
            )}
          </div>

          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '12px 16px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '10px 16px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#64748b',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: `all 150ms ease-in-out`,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.color = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f1f5f9';
                e.target.style.color = '#64748b';
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '10px 16px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'white',
                backgroundColor: saving ? '#94a3b8' : '#2563eb',
                border: 'none',
                borderRadius: '8px',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: `all 150ms ease-in-out`,
                boxShadow: saving ? 'none' : '0 1px 3px rgba(37, 99, 235, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = '#1e40af';
                  e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.boxShadow = '0 1px 3px rgba(37, 99, 235, 0.2)';
                }
              }}
            >
              {saving ? 'Creating...' : 'Create Component'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComponentCreator;
