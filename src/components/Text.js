import React from 'react';

// Helper function to get font size value from size prop
const getSizeValue = (size) => {
  const sizes = {
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem'
  };
  return sizes[size] || sizes['base'];
};

// Helper function to get line height from size prop
const getLineHeight = (size) => {
  const lineHeights = {
    'sm': '1.6',
    'base': '1.7',
    'lg': '1.8',
    'xl': '1.9'
  };
  return lineHeights[size] || lineHeights['base'];
};

// Helper function to get font weight value from weight prop
const getWeight = (weight) => {
  const weights = {
    'normal': 400,
    'semibold': 600,
    'bold': 700
  };
  return weights[weight] || weights['normal'];
};

const Text = ({
  content = 'Enter text',
  size = 'base',
  color = '#1e293b',
  weight = 'normal',
  align = 'left',
  lineHeight,
  style = {}
}) => {
  // Ensure content is a string for safe rendering (XSS prevention)
  const textContent = typeof content === 'string' ? content : String(content || '');

  // Determine line height - use lineHeight prop if provided, otherwise use default for size
  const finalLineHeight = lineHeight || getLineHeight(size);

  const textStyle = {
    fontSize: getSizeValue(size),
    color: color || '#1e293b',
    fontWeight: getWeight(weight),
    textAlign: align || 'left',
    lineHeight: finalLineHeight,
    marginBottom: '16px',
    marginTop: 0,
    padding: 0,
    letterSpacing: '0.3px',
    wordSpacing: '0.05em',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    ...style
  };

  return (
    <p
      className="text"
      style={textStyle}
    >
      {textContent}
    </p>
  );
};

export default Text;
