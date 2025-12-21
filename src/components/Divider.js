import React from 'react';

const Divider = ({
  color = 'default',
  variant = 'solid',
  thickness = 'normal',
  margin = 'md',
  fullWidth = true,
  orientation = 'horizontal',
  style = {}
}) => {
  const colorMap = {
    default: '#e2e8f0',
    dark: '#cbd5e1',
    primary: '#2563eb',
    success: '#10b981',
    danger: '#ef4444',
    muted: '#94a3b8'
  };

  const thicknessMap = {
    thin: '0.5px',
    normal: '1px',
    thick: '2px',
    xl: '3px'
  };

  const marginMap = {
    sm: orientation === 'horizontal' ? '16px 0' : '0 12px',
    md: orientation === 'horizontal' ? '28px 0' : '0 20px',
    lg: orientation === 'horizontal' ? '40px 0' : '0 32px',
    xl: orientation === 'horizontal' ? '56px 0' : '0 48px'
  };

  const gradientMap = {
    'blue-gradient': 'linear-gradient(90deg, #2563eb, transparent)',
    'green-gradient': 'linear-gradient(90deg, #10b981, transparent)',
    'purple-gradient': 'linear-gradient(90deg, #8b5cf6, transparent)',
    'rainbow': 'linear-gradient(90deg, #2563eb, #10b981, #f59e0b, #ef4444, transparent)'
  };

  const resolveColor = () => {
    if (colorMap[color]) return colorMap[color];
    return color || '#e2e8f0';
  };

  const resolveThickness = () => thicknessMap[thickness] || thicknessMap.normal;

  const resolveMargin = () => marginMap[margin] || marginMap.md;

  const getBackground = () => {
    if (gradientMap[color]) {
      return gradientMap[color];
    }

    if (variant === 'gradient') {
      return `linear-gradient(${orientation === 'horizontal' ? '90deg' : '0deg'}, ${resolveColor()}, transparent)`;
    }

    if (variant === 'dashed') {
      return `repeating-linear-gradient(${orientation === 'horizontal' ? '90deg' : '0deg'}, ${resolveColor()} 0px, ${resolveColor()} 8px, transparent 8px, transparent 14px)`;
    }

    if (variant === 'dotted') {
      return `repeating-linear-gradient(${orientation === 'horizontal' ? '90deg' : '0deg'}, ${resolveColor()} 0px, ${resolveColor()} 2px, transparent 2px, transparent 6px)`;
    }

    return resolveColor();
  };

  const baseStyle = {
    display: orientation === 'horizontal' ? 'block' : 'inline-block',
    boxSizing: 'border-box',
    border: 'none',
    background: getBackground(),
    transition: 'background 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '1px',
    margin: resolveMargin()
  };

  if (orientation === 'horizontal') {
    baseStyle.width = fullWidth ? '100%' : 'auto';
    baseStyle.minHeight = resolveThickness();
    baseStyle.height = resolveThickness();
  } else {
    baseStyle.height = fullWidth ? '100%' : 'auto';
    baseStyle.minWidth = resolveThickness();
    baseStyle.width = resolveThickness();
  }

  return (
    <div
      className="divider"
      style={{
        ...baseStyle,
        ...style
      }}
    />
  );
};

export default Divider;