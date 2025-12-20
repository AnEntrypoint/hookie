import React from 'react';

export function Text(props = {}, children) {
  return (
    <div className="Text" data-component="Text">
      {children}
    </div>
  );
}

export default Text;