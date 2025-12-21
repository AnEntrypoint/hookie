import React from 'react';

const getPaddingValue = (padding) => {
  const paddingMap = {
    sm: { vertical: 24, horizontal: 20 },
    md: { vertical: 40, horizontal: 32 },
    lg: { vertical: 56, horizontal: 48 },
    xl: { vertical: 72, horizontal: 64 },
    '2xl': { vertical: 88, horizontal: 80 }
  };
  const preset = paddingMap[padding] || paddingMap.md;
  return `${preset.vertical}px ${preset.horizontal}px`;
};

const getBackgroundValue = (background) => {
  const backgroundMap = {
    transparent: 'transparent',
    light: '#f8fafc',
    white: '#ffffff',
    subtle: '#f1f5f9',
    'gradient-blue': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    'gradient-green': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    'gradient-purple': 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)'
  };
  return backgroundMap[background] || background || 'transparent';
};

const Section = ({
  title,
  subtitle,
  padding = 'md',
  background = 'transparent',
  fullWidth = false,
  children,
  style = {}
}) => {
  const backgroundValue = getBackgroundValue(background);
  const hasBackground = background && background !== 'transparent';

  const containerStyle = {
    width: fullWidth ? '100%' : 'auto',
    maxWidth: fullWidth ? '100%' : '1200px',
    margin: '0 auto',
    padding: getPaddingValue(padding),
    background: backgroundValue,
    transition: 'background 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: hasBackground ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
    position: 'relative',
    ...style
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: '32px',
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    letterSpacing: '-0.6px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    fontWeight: 500,
    color: '#64748b',
    marginBottom: '24px',
    marginTop: '-12px',
    marginLeft: 0,
    marginRight: 0
  };

  return (
    <div className="section" style={containerStyle}>
      {title && <h2 style={titleStyle}>{title}</h2>}
      {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      {children}
    </div>
  );
};

export default Section;
