import React from 'react';

const Heading = ({
  level = 1,
  text = 'Heading',
  color = '#000000',
  align = 'left',
  style = {}
}) => {
  // Clamp level to valid range (1-6)
  const validLevel = Math.max(1, Math.min(6, level));

  const headingStyle = {
    color,
    textAlign: align,
    ...style
  };

  const headingClassName = `heading heading-${validLevel}`;

  // Dynamically create the appropriate heading element
  return React.createElement(
    `h${validLevel}`,
    { className: headingClassName, style: headingStyle },
    text
  );
};

export default Heading;
