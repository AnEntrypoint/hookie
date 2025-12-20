import React from 'react';

export function Link(props = {}, children) {
  return (
    <div className="Link" data-component="Link">
      {children}
    </div>
  );
}

export default Link;