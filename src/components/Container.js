import React from 'react';

// Helper function to get padding value based on variant
const getPadding = (paddingVariant) => {
  const paddings = {
    'none': '0',
    'sm': '0 12px',
    'md': '0 24px',
    'lg': '0 32px',
    'xl': '0 48px'
  };
  return paddings[paddingVariant] || paddings['md'];
};

const Container = ({
  maxWidth = '1200px',
  padding = 'md',
  children,
  style = {}
}) => {
  const containerStyle = {
    display: 'block',
    width: '100%',
    maxWidth: maxWidth,
    margin: '0 auto',
    padding: getPadding(padding),
    boxSizing: 'border-box',
    ...style
  };

  return (
    <div
      className="container"
      style={containerStyle}
    >
      {children}
    </div>
  );
};

export default Container;
