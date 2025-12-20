import React from 'react';

export function Heading(props = {}, children) {
  return (
    <div className="Heading" data-component="Heading">
      {children}
    </div>
  );
}

export default Heading;