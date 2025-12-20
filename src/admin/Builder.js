import React from 'react';

export function Builder(props = {}, children) {
  return (
    <div className="Builder" data-component="Builder">
      {children}
    </div>
  );
}

export default Builder;