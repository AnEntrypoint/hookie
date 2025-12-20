import React from 'react';

const Text = ({
  content = 'Enter text',
  fontSize = '16px',
  color = '#000000',
  fontWeight = 'normal',
  align = 'left',
  style = {}
}) => {
  const textStyle = {
    fontSize,
    color,
    fontWeight,
    textAlign: align,
    ...style
  };

  return (
    <p className="text" style={textStyle}>
      {content}
    </p>
  );
};

export default Text;
