import React, { useState } from 'react';
import {
  sizeStyles,
  getVariantStyles,
  getHoverStyles,
  getActiveStyles,
  getFocusStyles
} from './buttonStyles';

const Button = ({
  label = 'Click me',
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  style = {}
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) {
      setIsActive(true);
    }
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  const handleClick = (e) => {
    if (!disabled && typeof onClick === 'function') {
      onClick(e);
    }
  };

  const variantStyles = getVariantStyles(variant, disabled);
  const activeStyles = isActive && !disabled ? getActiveStyles(variant) : {};
  
  const buttonStyle = {
    ...variantStyles,
    ...sizeStyles[size],
    width: fullWidth ? '100%' : 'auto',
    display: fullWidth ? 'block' : 'inline-block',
    ...activeStyles,
    ...style
  };

  const focusStyles = getFocusStyles(variant);

  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled}
      onFocus={(e) => {
        e.target.style.outline = focusStyles.outline;
        e.target.style.outlineOffset = focusStyles.outlineOffset;
      }}
      onBlur={(e) => {
        e.target.style.outline = 'none';
      }}
    >
      {label}
    </button>
  );
};

export default Button;
