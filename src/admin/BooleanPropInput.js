import React from 'react';

const BooleanPropInput = ({ value, onChange }) => {
  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '38px',
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  };

  return (
    <div style={wrapperStyle}>
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
        style={checkboxStyle}
      />
    </div>
  );
};

export default BooleanPropInput;
