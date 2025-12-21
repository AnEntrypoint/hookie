import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_COLORS = {
  primary: '#2563eb',
  primaryDark: '#1e40af',
  primaryLight: '#dbeafe',
  success: '#10b981',
  successLight: '#d1fae5',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  lightBg: '#f8fafc',
  subtleBg: '#f1f5f9',
  border: '#e2e8f0',
  borderDark: '#cbd5e1',
  textDark: '#1e293b',
  textLight: '#64748b',
  textMuted: '#94a3b8',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
};

const isColorProp = (propName) => {
  const lowerName = propName.toLowerCase();
  return lowerName.includes('color') || lowerName.includes('background');
};

const coerceValue = (value, type) => {
  switch (type) {
    case 'number':
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value === 'true';
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

const validateJSON = (value, type) => {
  if (type === 'array' || type === 'object') {
    try {
      JSON.parse(value);
      return null;
    } catch (e) {
      return `Invalid JSON: ${e.message}`;
    }
  }
  return null;
};

const validateColorValue = (value) => {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i;
  const hslRegex = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i;
  
  if (hexRegex.test(value) || rgbRegex.test(value) || hslRegex.test(value)) {
    return null;
  }
  return 'Invalid color format';
};

const PropsEditor = ({ component, schema, onChange }) => {
  const [localProps, setLocalProps] = useState(component?.props || {});
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    setLocalProps(component?.props || {});
    setErrors({});
  }, [component?.id]);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleChange = (propName, value, propSchema) => {
    const coercedValue = coerceValue(value, propSchema?.type);
    const updatedProps = { ...localProps, [propName]: coercedValue };
    
    setLocalProps(updatedProps);

    let newError = null;
    if (propSchema?.type === 'array' || propSchema?.type === 'object') {
      if (typeof value === 'string' && value.trim()) {
        newError = validateJSON(value, propSchema.type);
      }
    } else if (isColorProp(propName)) {
      newError = validateColorValue(coercedValue);
    }

    setErrors(prev => ({
      ...prev,
      [propName]: newError
    }));

    onChange(updatedProps);
  };

  const handleJSONBlur = (propName, value, propSchema) => {
    if (typeof value === 'string' && value.trim()) {
      const error = validateJSON(value, propSchema?.type);
      setErrors(prev => ({
        ...prev,
        [propName]: error
      }));
    }
  };

  const renderStringInput = (propName, propSchema, firstField) => {
    const value = localProps[propName] ?? propSchema?.default ?? '';
    
    if (propSchema?.options && Array.isArray(propSchema.options)) {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(propName, e.target.value, propSchema)}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            border: `1px solid ${errors[propName] ? DEFAULT_COLORS.danger : DEFAULT_COLORS.border}`,
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: DEFAULT_COLORS.textDark,
            cursor: 'pointer',
            transition: '150ms ease-in-out',
            outline: 'none',
            boxShadow: errors[propName] ? `0 0 0 3px ${DEFAULT_COLORS.dangerLight}` : 'none',
          }}
        >
          <option value="">Select an option</option>
          {propSchema.options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        ref={firstField ? firstInputRef : null}
        type="text"
        value={value}
        onChange={(e) => handleChange(propName, e.target.value, propSchema)}
        placeholder={propSchema?.default ? `Default: ${propSchema.default}` : ''}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          border: `1px solid ${errors[propName] ? DEFAULT_COLORS.danger : DEFAULT_COLORS.border}`,
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          color: DEFAULT_COLORS.textDark,
          transition: '150ms ease-in-out',
          outline: 'none',
          boxShadow: errors[propName] ? `0 0 0 3px ${DEFAULT_COLORS.dangerLight}` : 'none',
        }}
      />
    );
  };

  const renderNumberInput = (propName, propSchema, firstField) => {
    const value = localProps[propName] ?? propSchema?.default ?? 0;
    
    return (
      <input
        ref={firstField ? firstInputRef : null}
        type="number"
        value={value}
        onChange={(e) => handleChange(propName, e.target.value, propSchema)}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          border: `1px solid ${errors[propName] ? DEFAULT_COLORS.danger : DEFAULT_COLORS.border}`,
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          color: DEFAULT_COLORS.textDark,
          transition: '150ms ease-in-out',
          outline: 'none',
          boxShadow: errors[propName] ? `0 0 0 3px ${DEFAULT_COLORS.dangerLight}` : 'none',
        }}
      />
    );
  };

  const renderBooleanInput = (propName, propSchema, firstField) => {
    const value = localProps[propName] ?? propSchema?.default ?? false;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          ref={firstField ? firstInputRef : null}
          type="checkbox"
          checked={value}
          onChange={(e) => handleChange(propName, e.target.checked, propSchema)}
          style={{
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            accentColor: DEFAULT_COLORS.primary,
          }}
        />
        <span style={{ fontSize: '0.875rem', color: DEFAULT_COLORS.textMuted }}>
          {value ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    );
  };

  const renderColorInput = (propName, propSchema, firstField) => {
    const value = localProps[propName] ?? propSchema?.default ?? '#2563eb';
    
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          ref={firstField ? firstInputRef : null}
          type="color"
          value={value}
          onChange={(e) => handleChange(propName, e.target.value, propSchema)}
          style={{
            width: '50px',
            height: '40px',
            border: `1px solid ${DEFAULT_COLORS.border}`,
            borderRadius: '4px',
            cursor: 'pointer',
            padding: '2px',
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(propName, e.target.value, propSchema)}
          placeholder="#000000"
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            border: `1px solid ${errors[propName] ? DEFAULT_COLORS.danger : DEFAULT_COLORS.border}`,
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: DEFAULT_COLORS.textDark,
            transition: '150ms ease-in-out',
            outline: 'none',
            boxShadow: errors[propName] ? `0 0 0 3px ${DEFAULT_COLORS.dangerLight}` : 'none',
          }}
        />
      </div>
    );
  };

  const renderArrayInput = (propName, propSchema, firstField) => {
    const value = localProps[propName] ?? propSchema?.default ?? [];
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    
    return (
      <textarea
        ref={firstField ? firstInputRef : null}
        value={stringValue}
        onChange={(e) => handleChange(propName, e.target.value, propSchema)}
        onBlur={(e) => handleJSONBlur(propName, e.target.value, propSchema)}
        placeholder='["item1", "item2"]'
        style={{
          width: '100%',
          minHeight: '100px',
          padding: '8px 12px',
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          border: `1px solid ${errors[propName] ? DEFAULT_COLORS.danger : DEFAULT_COLORS.border}`,
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          color: DEFAULT_COLORS.textDark,
          fontFeatureSettings: '"kern" 1',
          lineHeight: '1.5',
          resize: 'vertical',
          transition: '150ms ease-in-out',
          outline: 'none',
          boxShadow: errors[propName] ? `0 0 0 3px ${DEFAULT_COLORS.dangerLight}` : 'none',
        }}
      />
    );
  };

  const renderObjectInput = (propName, propSchema, firstField) => {
    const value = localProps[propName] ?? propSchema?.default ?? {};
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    
    return (
      <textarea
        ref={firstField ? firstInputRef : null}
        value={stringValue}
        onChange={(e) => handleChange(propName, e.target.value, propSchema)}
        onBlur={(e) => handleJSONBlur(propName, e.target.value, propSchema)}
        placeholder='{"key": "value"}'
        style={{
          width: '100%',
          minHeight: '100px',
          padding: '8px 12px',
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          border: `1px solid ${errors[propName] ? DEFAULT_COLORS.danger : DEFAULT_COLORS.border}`,
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          color: DEFAULT_COLORS.textDark,
          fontFeatureSettings: '"kern" 1',
          lineHeight: '1.5',
          resize: 'vertical',
          transition: '150ms ease-in-out',
          outline: 'none',
          boxShadow: errors[propName] ? `0 0 0 3px ${DEFAULT_COLORS.dangerLight}` : 'none',
        }}
      />
    );
  };

  const renderFunctionInput = () => {
    return (
      <div style={{
        padding: '12px',
        backgroundColor: DEFAULT_COLORS.gray100,
        border: `1px solid ${DEFAULT_COLORS.border}`,
        borderRadius: '4px',
        fontSize: '0.875rem',
        color: DEFAULT_COLORS.textMuted,
      }}>
        Functions cannot be edited in the visual editor
      </div>
    );
  };

  const renderNodeInput = () => {
    return (
      <div style={{
        padding: '12px',
        backgroundColor: DEFAULT_COLORS.successLight,
        border: `1px solid ${DEFAULT_COLORS.success}`,
        borderRadius: '4px',
        fontSize: '0.875rem',
        color: '#047857',
      }}>
        Children are managed in the canvas
      </div>
    );
  };

  const renderInput = (propName, propSchema, firstField) => {
    const type = propSchema?.type;

    if (type === 'function') {
      return renderFunctionInput();
    }

    if (type === 'node') {
      return renderNodeInput();
    }

    if (isColorProp(propName)) {
      return renderColorInput(propName, propSchema, firstField);
    }

    switch (type) {
      case 'string':
        return renderStringInput(propName, propSchema, firstField);
      case 'number':
        return renderNumberInput(propName, propSchema, firstField);
      case 'boolean':
        return renderBooleanInput(propName, propSchema, firstField);
      case 'array':
        return renderArrayInput(propName, propSchema, firstField);
      case 'object':
        return renderObjectInput(propName, propSchema, firstField);
      default:
        return renderStringInput(propName, propSchema, firstField);
    }
  };

  if (!schema || !schema.props || Object.keys(schema.props).length === 0) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: DEFAULT_COLORS.textMuted,
      }}>
        No props available for this component
      </div>
    );
  }

  const propEntries = Object.entries(schema.props);

  return (
    <form style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {propEntries.map(([propName, propSchema], index) => (
        <div key={propName} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          paddingBottom: '16px',
          borderBottom: index < propEntries.length - 1 ? `1px solid ${DEFAULT_COLORS.border}` : 'none',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: DEFAULT_COLORS.textDark,
          }}>
            {propName}
            {propSchema?.required && (
              <span style={{
                color: DEFAULT_COLORS.danger,
                fontSize: '1rem',
                lineHeight: '1',
              }}>
                *
              </span>
            )}
          </label>

          {renderInput(propName, propSchema, index === 0)}

          {errors[propName] && (
            <span style={{
              fontSize: '0.75rem',
              color: DEFAULT_COLORS.danger,
              marginTop: '4px',
            }}>
              {errors[propName]}
            </span>
          )}

          {propSchema?.default !== undefined && !errors[propName] && (
            <span style={{
              fontSize: '0.75rem',
              color: DEFAULT_COLORS.textMuted,
              marginTop: '2px',
            }}>
              Default: {typeof propSchema.default === 'object' ? JSON.stringify(propSchema.default) : String(propSchema.default)}
            </span>
          )}
        </div>
      ))}
    </form>
  );
};

export default PropsEditor;
