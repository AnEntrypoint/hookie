import React from 'react';
import { DEFAULT_COLORS } from './propsEditorHelpers';

const ColorPropInput = ({ value, onChange, isMobile }) => {
  const wrapperStyle = getWrapperStyle(isMobile);
  const colorPickerStyle = getColorPickerStyle(isMobile);
  const textInputStyle = getTextInputStyle(isMobile);

  const handleFocus = (e) => {
    e.target.style.borderColor = DEFAULT_COLORS.primary;
    e.target.style.boxShadow = `0 0 0 3px ${DEFAULT_COLORS.primaryLight}`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#ddd';
    e.target.style.boxShadow = 'none';
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

const getWrapperStyle = (isMobile) => ({
  display: 'flex',
  gap: '12px',
  alignItems: 'stretch',
  flexDirection: isMobile ? 'column' : 'row',
});

const getColorPickerStyle = (isMobile) => ({
  width: isMobile ? '100%' : '44px',
  minHeight: '44px',
  minWidth: isMobile ? 'auto' : '44px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
});

const getTextInputStyle = (isMobile) => ({
  flex: 1,
  width: isMobile ? '100%' : 'auto',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: isMobile ? '16px' : '14px',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  minHeight: '44px',
  lineHeight: '1.5',
  boxSizing: 'border-box',
});

export default ColorPropInput;
