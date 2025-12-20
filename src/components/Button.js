import React from 'react';

export function Button(props = {}, children) {
  return (
    <div className="Button" data-component="Button">
      {children}
    </div>
  );
}

export default Button;