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

  if (isMobile) {
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget && onClose) {
        onClose();
      }
    };

    return (
      <div style={getMobileWrapperStyle()} onClick={handleBackdropClick}>
        <form style={getMobileContainerStyle()} onClick={(e) => e.stopPropagation()}>
          {onClose && (
            <div style={getMobileHeaderStyle()}>
              <h3 style={{ margin: '0 0 0 0', fontSize: '18px', fontWeight: 600, color: DEFAULT_COLORS.textDark }}>
                Properties
              </h3>
              <button
                type="button"
                onClick={onClose}
                style={getCloseButtonStyle()}
              >
                ✕
              </button>
            </div>
          )}
          {propEntries.map(([propName, propSchema], index) => (
            <div key={propName} style={getFieldWrapperStyle(index, propEntries.length)}>
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
                isMobile={isMobile}
              />
            </div>
          ))}
        </form>
      </div>
    );
  }

  const containerStyle = getDesktopContainerStyle();

  return (
    <form style={containerStyle}>
      {propEntries.map(([propName, propSchema], index) => (
        <div key={propName} style={getFieldWrapperStyle(index, propEntries.length)}>
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
            isMobile={isMobile}
          />
        </div>
      ))}
    </form>
  );
};

const getMobileWrapperStyle = () => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 999,
});

const getMobileContainerStyle = () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '16px',
  maxHeight: 'calc(100vh - 60px)',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  marginTop: 'auto',
  backgroundColor: '#fff',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  maxWidth: '100vw',
});

const getDesktopContainerStyle = () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '0',
});

const getMobileHeaderStyle = () => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '16px',
  borderBottom: `1px solid ${DEFAULT_COLORS.border}`,
  position: 'sticky',
  top: 0,
  backgroundColor: '#fff',
  zIndex: 10,
  marginLeft: '-16px',
  marginRight: '-16px',
  paddingLeft: '16px',
  paddingRight: '16px',
  marginBottom: '8px',
});

const getCloseButtonStyle = () => ({
  background: 'none',
  border: 'none',
  fontSize: '24px',
  color: DEFAULT_COLORS.textMuted,
  cursor: 'pointer',
  padding: '4px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '44px',
  minHeight: '44px',
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',
});

const getFieldWrapperStyle = (index, total) => ({
  paddingBottom: '24px',
  borderBottom: index < total - 1 ? `1px solid ${DEFAULT_COLORS.border}` : 'none',
});

const getEmptyStateStyle = (isMobile) => ({
  padding: isMobile ? '24px 16px' : '24px',
  textAlign: 'center',
  color: DEFAULT_COLORS.textMuted,
  fontSize: isMobile ? '16px' : '14px',
});

export default PropsEditor;
