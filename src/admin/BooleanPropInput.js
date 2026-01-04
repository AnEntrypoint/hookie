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
  minHeight: '44px',
  padding: '6px 0',
});

const getCheckboxStyle = (isMobile) => ({
  width: '20px',
  height: '20px',
  cursor: 'pointer',
  minWidth: '20px',
  minHeight: '20px',
  accentColor: '#2563eb',
});

const getCheckboxLabelStyle = (isMobile) => ({
  fontSize: isMobile ? '16px' : '14px',
  color: '#333',
  fontWeight: '500',
  cursor: 'pointer',
  userSelect: 'none',
});

export default BooleanPropInput;
