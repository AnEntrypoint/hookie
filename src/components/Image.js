import React from 'react';

export function Image(props = {}, children) {
  return (
    <div className="Image" data-component="Image">
      {children}
    </div>
  );
}

export default Image;