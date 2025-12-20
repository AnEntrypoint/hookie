import React from 'react';

const Button = ({
  label = 'Click me',
  onClick,
  background = '#007bff',
  color = '#ffffff',
  padding = '10px 20px',
  borderRadius = '4px',
  style = {}
}) => {
  const handleClick = (e) => {
    if (onClick && typeof onClick === 'function') {
      onClick(e);
    }
  };

  const buttonStyle = {
    background,
    color,
    padding,
    borderRadius,
    cursor: 'pointer',
    border: 'none',
    userSelect: 'none',
    ...style
  };

  return (
    <button
      className="button"
      type="button"
      style={buttonStyle}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

export default Button;
