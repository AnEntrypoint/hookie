import React from 'react';

export function List(props = {}, children) {
  return (
    <div className="List" data-component="List">
      {children}
    </div>
  );
}

export default List;