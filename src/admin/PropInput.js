import React, { useRef, useEffect } from 'react';
import StringPropInput from './StringPropInput';
import NumberPropInput from './NumberPropInput';
import BooleanPropInput from './BooleanPropInput';
import ColorPropInput from './ColorPropInput';
import JSONPropInput from './JSONPropInput';
import { isColorProp, DEFAULT_COLORS } from './propsEditorHelpers';

const PropInput = ({ propName, propSchema, value, error, onChange, isFirstField, isMobile }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFirstField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFirstField]);

  const handleChange = typeof onChange === 'function' ? onChange : (onChange?.onChange || (() => {}));
  const handleBlur = typeof onChange === 'object' ? (onChange?.onBlur || (() => {})) : (() => {});

  const renderInput = () => {
    const { type, options } = propSchema;

    if (type === 'string' && isColorProp(propName)) {
      return <ColorPropInput value={value} onChange={handleChange} isMobile={isMobile} />;
    }

    if (type === 'string') {
      return <StringPropInput value={value} options={options} onChange={handleChange} isMobile={isMobile} />;
    }

    if (type === 'number') {
      return <NumberPropInput value={value} onChange={handleChange} isMobile={isMobile} />;
    }

    if (type === 'boolean') {
      return <BooleanPropInput value={value} onChange={handleChange} isMobile={isMobile} />;
    }

    if (type === 'array' || type === 'object') {
      return (
        <JSONPropInput
          value={value}
          type={type}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error}
          isMobile={isMobile}
        />
      );
    }

    if (type === 'function') {
      return (
        <span style={getNonEditableTextStyle(isMobile)}>
          Functions are not editable in visual editor
        </span>
      );
    }

    if (type === 'node') {
      return (
        <span style={getNonEditableTextStyle(isMobile)}>
          Children managed in canvas
        </span>
      );
    }

    return <StringPropInput value={value} onChange={handleChange} isMobile={isMobile} />;
  };

  const labelStyle = getLabelStyle(isMobile);
  const fieldWrapperStyle = getFieldWrapperStyle(isMobile);

  return (
    <div className="props-editor-field" style={fieldWrapperStyle} ref={inputRef}>
      <label className="props-editor-label" style={labelStyle}>
        {propName}
        {propSchema.required && (
          <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
        )}
      </label>

      {renderInput()}

      {error && (
        <span className="props-editor-error" style={getErrorStyle(isMobile)}>
          {error}
        </span>
      )}

      {propSchema.default !== undefined && (
        <span className="props-editor-hint" style={getHintStyle(isMobile)}>
          Default: {JSON.stringify(propSchema.default)}
        </span>
      )}
    </div>
  );
};

const getFieldWrapperStyle = (isMobile) => ({
  marginBottom: isMobile ? '24px' : '16px',
});

const getLabelStyle = (isMobile) => ({
  display: 'block',
  marginBottom: isMobile ? '8px' : '4px',
  fontWeight: '600',
  fontSize: isMobile ? '16px' : '14px',
  color: DEFAULT_COLORS.textDark,
  lineHeight: '1.4',
});

const getErrorStyle = (isMobile) => ({
  color: '#dc3545',
  fontSize: isMobile ? '14px' : '12px',
  marginTop: '8px',
  display: 'block',
  lineHeight: '1.4',
});

const getHintStyle = (isMobile) => ({
  color: DEFAULT_COLORS.textMuted,
  fontSize: isMobile ? '14px' : '12px',
  marginTop: '6px',
  display: 'block',
  lineHeight: '1.4',
});

const getNonEditableTextStyle = (isMobile) => ({
  fontStyle: 'italic',
  color: '#6c757d',
  fontSize: isMobile ? '16px' : '14px',
  lineHeight: '1.4',
  display: 'block',
});

export default PropInput;
