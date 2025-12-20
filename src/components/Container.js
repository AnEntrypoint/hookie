import React from 'react';

const Container = ({
  maxWidth = '1200px',
  children,
  style = {}
}) => {
  const containerStyle = {
    maxWidth,
    margin: '0 auto',
    padding: '0 16px',
    ...style
  };

  return (
    <div className="container" style={containerStyle}>
      {children}
    </div>
  );
};

export default Container;
