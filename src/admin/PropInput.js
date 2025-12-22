import React, { useRef, useEffect } from 'react';
import StringPropInput from './StringPropInput';
import NumberPropInput from './NumberPropInput';
import BooleanPropInput from './BooleanPropInput';
import ColorPropInput from './ColorPropInput';
import JSONPropInput from './JSONPropInput';
import { isColorProp, DEFAULT_COLORS } from './propsEditorHelpers';

const PropInput = ({ propName, propSchema, value, error, onChange, isFirstField }) => {
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
      return <ColorPropInput value={value} onChange={handleChange} />;
    }

    if (type === 'string') {
      return <StringPropInput value={value} options={options} onChange={handleChange} />;
    }

    if (type === 'number') {
      return <NumberPropInput value={value} onChange={handleChange} />;
    }

    if (type === 'boolean') {
      return <BooleanPropInput value={value} onChange={handleChange} />;
    }

    if (type === 'array' || type === 'object') {
      return (
        <JSONPropInput
          value={value}
          type={type}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error}
        />
      );
    }

    if (type === 'function') {
      return (
        <span style={{ fontStyle: 'italic', color: '#6c757d', fontSize: '14px' }}>
          Functions are not editable in visual editor
        </span>
      );
    }

    if (type === 'node') {
      return (
        <span style={{ fontStyle: 'italic', color: '#6c757d', fontSize: '14px' }}>
          Children managed in canvas
        </span>
      );
    }

    return <StringPropInput value={value} onChange={handleChange} />;
  };

  return (
    <div className="props-editor-field" style={{ marginBottom: '16px' }} ref={inputRef}>
      <label
        className="props-editor-label"
        style={{
          display: 'block',
          marginBottom: '4px',
          fontWeight: '500',
          fontSize: '14px',
          color: '#333',
        }}
      >
        {propName}
        {propSchema.required && (
          <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
        )}
      </label>

      {renderInput()}

      {error && (
        <span
          className="props-editor-error"
          style={{
            color: '#dc3545',
            fontSize: '12px',
            marginTop: '4px',
            display: 'block',
          }}
        >
          {error}
        </span>
      )}

      {propSchema.default !== undefined && (
        <span
          className="props-editor-hint"
          style={{
            color: '#6c757d',
            fontSize: '12px',
            marginTop: '4px',
            display: 'block',
          }}
        >
          Default: {JSON.stringify(propSchema.default)}
        </span>
      )}
    </div>
  );
};

export default PropInput;
