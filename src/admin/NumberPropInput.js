import React from 'react';
import { DEFAULT_COLORS } from './propsEditorHelpers';

const NumberPropInput = ({ value, onChange, isMobile }) => {
  const inputStyle = getInputStyle(isMobile);

  const handleFocus = (e) => {
    e.target.style.borderColor = DEFAULT_COLORS.primary;
    e.target.style.boxShadow = `0 0 0 3px ${DEFAULT_COLORS.primaryLight}`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#ddd';
    e.target.style.boxShadow = 'none';
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

const getInputStyle = (isMobile) => ({
  padding: isMobile ? '12px' : '8px',
  border: `1px solid #ddd`,
  borderRadius: '4px',
  fontSize: isMobile ? '16px' : '14px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  minHeight: isMobile ? '44px' : 'auto',
  lineHeight: '1.5',
});

export default NumberPropInput;
