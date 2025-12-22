import React from 'react';
import { DEFAULT_COLORS } from './propsEditorHelpers';

const NumberPropInput = ({ value, onChange }) => {
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

  return (
    <input
      type="number"
      value={value || 0}
      onChange={(e) => onChange(Number(e.target.value))}
      onFocus={handleFocus}
      onBlur={handleBlur}
      step="any"
      style={inputStyle}
    />
  );
};

export default NumberPropInput;
