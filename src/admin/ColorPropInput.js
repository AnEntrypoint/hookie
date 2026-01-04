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
  gap: isMobile ? '12px' : '8px',
  alignItems: 'center',
  flexDirection: isMobile ? 'column' : 'row',
});

const getColorPickerStyle = (isMobile) => ({
  width: isMobile ? '100%' : '50px',
  height: isMobile ? '48px' : '38px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  minHeight: isMobile ? '48px' : 'auto',
});

const getTextInputStyle = (isMobile) => ({
  flex: 1,
  width: isMobile ? '100%' : 'auto',
  padding: isMobile ? '12px' : '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: isMobile ? '16px' : '14px',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  minHeight: isMobile ? '44px' : 'auto',
  lineHeight: '1.5',
});

export default ColorPropInput;
