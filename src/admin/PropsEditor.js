// PropsEditor.js
// Main orchestrator component for editing component props
// Manages state and validation, delegates rendering to PropInput

import React, { useState, useEffect } from 'react';
import PropInput from './PropInput';
import {
  DEFAULT_COLORS,
  coerceValue,
  validateJSON,
  validateColorValue,
  isColorProp,
} from './propsEditorHelpers';

const PropsEditor = ({ component, schema, onChange }) => {
  const [localProps, setLocalProps] = useState(component?.props || {});
  const [errors, setErrors] = useState({});

  // Reset when component changes
  useEffect(() => {
    setLocalProps(component?.props || {});
    setErrors({});
  }, [component?.id]);

  // Handle prop value changes
  const handleChange = (propName, propSchema) => (value) => {
    const coercedValue = coerceValue(value, propSchema?.type);
    const updatedProps = { ...localProps, [propName]: coercedValue };
    
    setLocalProps(updatedProps);

    // Validate the new value
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

    // Emit changes immediately (auto-save)
    onChange(updatedProps);
  };

  // Handle JSON blur validation for arrays/objects
  const handleJSONBlur = (propName, propSchema) => (value) => {
    if (typeof value === 'string' && value.trim()) {
      const error = validateJSON(value, propSchema?.type);
      setErrors(prev => ({
        ...prev,
        [propName]: error
      }));
    }
  };

  // No props available
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
          paddingBottom: '16px',
          borderBottom: index < propEntries.length - 1 ? `1px solid ${DEFAULT_COLORS.border}` : 'none',
        }}>
          <PropInput
            propName={propName}
            propSchema={propSchema}
            value={localProps[propName]}
            error={errors[propName]}
            onChange={{
              ...handleChange(propName, propSchema),
              onBlur: handleJSONBlur(propName, propSchema),
            }}
            isFirstField={index === 0}
          />
        </div>
      ))}
    </form>
  );
};

export default PropsEditor;
