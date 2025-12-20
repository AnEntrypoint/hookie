import React from 'react';

const Divider = ({
  color = '#e0e0e0',
  height = '1px',
  margin = '16px 0',
  style = {}
}) => {
  const dividerStyle = {
    backgroundColor: color,
    height,
    margin,
    border: 'none',
    width: '100%',
    ...style
  };

  return (
    <div className="divider" style={dividerStyle} />
  );
};

export default Divider;
