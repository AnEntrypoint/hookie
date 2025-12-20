import React from 'react';

const Image = ({
  src = 'https://via.placeholder.com/400x300',
  alt = 'Image',
  width = 'auto',
  height = 'auto',
  borderRadius = '0',
  style = {}
}) => {
  const imageStyle = {
    width,
    height,
    borderRadius,
    display: 'block',
    maxWidth: '100%',
    ...style
  };

  return (
    <img
      className="image"
      src={src}
      alt={alt}
      style={imageStyle}
    />
  );
};

export default Image;
