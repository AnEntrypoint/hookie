import React from 'react';

const BooleanPropInput = ({ value, onChange, isMobile }) => {
  const wrapperStyle = getWrapperStyle(isMobile);
  const checkboxStyle = getCheckboxStyle(isMobile);

  return (
    <div style={wrapperStyle}>
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
        style={checkboxStyle}
      />
      <span style={getCheckboxLabelStyle(isMobile)}>
        {value ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
};

const getWrapperStyle = (isMobile) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minHeight: isMobile ? '44px' : '38px',
  padding: isMobile ? '8px 0' : '0',
});

const getCheckboxStyle = (isMobile) => ({
  width: isMobile ? '24px' : '18px',
  height: isMobile ? '24px' : '18px',
  cursor: 'pointer',
  minWidth: isMobile ? '24px' : '18px',
});

const getCheckboxLabelStyle = (isMobile) => ({
  fontSize: isMobile ? '16px' : '14px',
  color: '#333',
  fontWeight: '500',
  cursor: 'pointer',
  userSelect: 'none',
});

export default BooleanPropInput;
