import React from 'react';

export function Grid(props = {}, children) {
  return (
    <div className="Grid" data-component="Grid">
      {children}
    </div>
  );
}

export default Grid;