import React, { useState, useEffect } from 'react';
import { DEFAULT_COLORS } from './propsEditorHelpers';

const JSONPropInput = ({ value, type, onChange, onBlur, error, isMobile }) => {
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

  const handleBlurCallback = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  const textareaStyle = getTextareaStyle(isMobile, error);
  const errorStyle = getErrorStyle(isMobile);

  const handleFocus = (e) => {
    if (!error) {
      e.target.style.borderColor = DEFAULT_COLORS.primary;
      e.target.style.boxShadow = `0 0 0 3px ${DEFAULT_COLORS.primaryLight}`;
    }
  };

  const handleBlurStyle = (e) => {
    if (!error) {
      e.target.style.borderColor = '#ddd';
      e.target.style.boxShadow = 'none';
    }
  };

  return (
    <div>
      <textarea
        value={localValue}
        onChange={handleChange}
        onBlur={(e) => {
          handleBlurCallback(e);
          handleBlurStyle(e);
        }}
        onFocus={handleFocus}
        rows={isMobile ? 8 : 6}
        style={textareaStyle}
        placeholder={type === 'array' ? '[\n  "item1",\n  "item2"\n]' : '{\n  "key": "value"\n}'}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};

const getTextareaStyle = (isMobile, error) => ({
  width: '100%',
  padding: isMobile ? '12px' : '8px',
  border: `1px solid ${error ? '#dc3545' : '#ddd'}`,
  borderRadius: '4px',
  fontSize: isMobile ? '15px' : '13px',
  fontFamily: 'monospace',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  resize: 'vertical',
  minHeight: isMobile ? '200px' : 'auto',
  lineHeight: '1.6',
  lineBreak: 'auto',
});

const getErrorStyle = (isMobile) => ({
  color: '#dc3545',
  fontSize: isMobile ? '14px' : '12px',
  marginTop: '8px',
  display: 'block',
  lineHeight: '1.4',
});

export default JSONPropInput;
