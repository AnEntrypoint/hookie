import React from 'react';

export function Divider(props = {}, children) {
  return (
    <div className="Divider" data-component="Divider">
      {children}
    </div>
  );
}

export default Divider;