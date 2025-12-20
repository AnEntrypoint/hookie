import React from 'react';

export function Container(props = {}, children) {
  return (
    <div className="Container" data-component="Container">
      {children}
    </div>
  );
}

export default Container;