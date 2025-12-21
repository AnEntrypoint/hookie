import React from 'react';

const getPadding = (paddingProp) => {
  const paddings = {
    none: '0',
    sm: '12px 16px',
    md: '16px 24px',
    lg: '20px 32px',
    xl: '28px 48px',
    '2xl': '32px 64px'
  };
  return paddings[paddingProp] || paddings.md;
};

const getMaxWidth = (maxWidthProp) => {
  const maxWidths = {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1200px',
    '2xl': '1400px'
  };
  return maxWidths[maxWidthProp] || maxWidthProp || '1200px';
};

export default function Container({
  maxWidth = 'xl',
  padding = 'md',
  children,
  style = {}
}) {
  const containerStyle = {
    display: 'block',
    width: '100%',
    maxWidth: getMaxWidth(maxWidth),
    margin: '0 auto',
    padding: getPadding(padding),
    boxSizing: 'border-box',
    transition: 'padding 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    ...style
  };

  return (
    <div style={containerStyle}>
      {children}
    </div>
  );
}
