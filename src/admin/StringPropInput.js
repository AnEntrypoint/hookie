import React from 'react';
import { DEFAULT_COLORS } from './propsEditorHelpers';

const StringPropInput = ({ value, options, onChange }) => {
  const hasOptions = options && Array.isArray(options) && options.length > 0;

  const inputStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = DEFAULT_COLORS.primary;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#ddd';
  };

  if (hasOptions) {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={inputStyle}
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={inputStyle}
    />
  );
};

export default StringPropInput;
