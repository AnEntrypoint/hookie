import React, { useState, useEffect } from 'react';
import PropInput from './PropInput';
import {
  DEFAULT_COLORS,
  coerceValue,
  validateJSON,
  validateColorValue,
  isColorProp,
} from './propsEditorHelpers';
import componentRegistry from '../lib/componentRegistry';
import { findComponentById } from './builderHelpers';
import {
  getMobileWrapperStyle,
  getMobileContainerStyle,
  getDesktopContainerStyle,
  getMobileHeaderStyle,
  getCloseButtonStyle,
  getFieldWrapperStyle,
  getEmptyStateStyle,
} from './propsEditorStyles';

const PropsEditor = ({ component, schema, onChange, onClose, isMobile, componentId, pageData }) => {
  const [localProps, setLocalProps] = useState({});
  const [errors, setErrors] = useState({});
  const [componentSchema, setComponentSchema] = useState(null);

  useEffect(() => {
    if (component) {
      setLocalProps(component?.props || {});
      setComponentSchema(schema);
    } else if (componentId && pageData) {
      const foundComponent = findComponentById(pageData, componentId);
      if (foundComponent) {
        setLocalProps(foundComponent.props || {});
        const foundSchema = componentRegistry.getComponent(foundComponent.type);
        setComponentSchema(foundSchema);
      }
    }
    setErrors({});
  }, [component?.id, componentId, pageData, schema]);

  const handleChange = (propName, propSchema) => (value) => {
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

  const handleJSONBlur = (propName, propSchema) => (value) => {
    if (typeof value === 'string' && value.trim()) {
      const error = validateJSON(value, propSchema?.type);
      setErrors(prev => ({
        ...prev,
        [propName]: error
      }));
    }
  };

  const activeSchema = componentSchema || schema;

  if (!activeSchema || !activeSchema.props || Object.keys(activeSchema.props).length === 0) {
    return (
      <div style={getEmptyStateStyle(isMobile)}>
        No props available for this component
      </div>
    );
  }

  const propEntries = Object.entries(activeSchema.props);

  const renderPropInputs = () =>
    propEntries.map(([propName, propSchema], index) => (
      <div key={propName} style={getFieldWrapperStyle(index, propEntries.length)}>
        <PropInput
          propName={propName}
          propSchema={propSchema}
          value={localProps[propName]}
          error={errors[propName]}
          onChange={{
            onChange: handleChange(propName, propSchema),
            onBlur: handleJSONBlur(propName, propSchema),
          }}
          isFirstField={index === 0}
          isMobile={isMobile}
        />
      </div>
    ));

  if (isMobile) {
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget && onClose) onClose();
    };

    return (
      <div style={getMobileWrapperStyle()} onClick={handleBackdropClick}>
        <form style={getMobileContainerStyle()} onClick={(e) => e.stopPropagation()}>
          {onClose && (
            <div style={getMobileHeaderStyle()}>
              <h3 style={{ margin: '0 0 0 0', fontSize: '18px', fontWeight: 600, color: DEFAULT_COLORS.textDark }}>
                Properties
              </h3>
              <button type="button" onClick={onClose} style={getCloseButtonStyle()}>
                ✕
              </button>
            </div>
          )}
          {renderPropInputs()}
        </form>
      </div>
    );
  }

  return (
    <form style={getDesktopContainerStyle()}>
      {renderPropInputs()}
    </form>
  );
};

export default PropsEditor;
