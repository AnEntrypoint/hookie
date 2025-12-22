import React from 'react';
import { DEFAULT_COLORS } from './propsEditorHelpers';

const ColorPropInput = ({ value, onChange }) => {
  const wrapperStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const colorPickerStyle = {
    width: '50px',
    height: '38px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const textInputStyle = {
    flex: 1,
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
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
    <div style={wrapperStyle}>
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={colorPickerStyle}
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="#000000 or rgb(0,0,0)"
        style={textInputStyle}
      />
    </div>
  );
};

export default ColorPropInput;
