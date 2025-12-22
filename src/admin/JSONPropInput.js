import React, { useState, useEffect } from 'react';
import { DEFAULT_COLORS } from './propsEditorHelpers';

const JSONPropInput = ({ value, type, onChange, onBlur, error }) => {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    try {
      setLocalValue(JSON.stringify(value, null, 2));
    } catch (err) {
      setLocalValue(type === 'array' ? '[]' : '{}');
    }
  }, [value, type]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    try {
      const parsed = JSON.parse(newValue);
      onChange(parsed);
    } catch (err) {
    }
  };

  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  const textareaStyle = {
    width: '100%',
    padding: '8px',
    border: `1px solid ${error ? '#dc3545' : '#ddd'}`,
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'monospace',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    resize: 'vertical',
  };

  const errorStyle = {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
  };

  const handleFocus = (e) => {
    if (!error) {
      e.target.style.borderColor = DEFAULT_COLORS.primary;
    }
  };

  const handleBlurStyle = (e) => {
    if (!error) {
      e.target.style.borderColor = '#ddd';
    }
  };

  return (
    <div>
      <textarea
        value={localValue}
        onChange={handleChange}
        onBlur={(e) => {
          handleBlur(e);
          handleBlurStyle(e);
        }}
        onFocus={handleFocus}
        rows={6}
        style={textareaStyle}
        placeholder={type === 'array' ? '[\n  "item1",\n  "item2"\n]' : '{\n  "key": "value"\n}'}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};

export default JSONPropInput;
