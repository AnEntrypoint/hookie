import React from 'react';

export function StyleEditor(props = {}, children) {
  return (
    <div className="StyleEditor" data-component="StyleEditor">
      {children}
    </div>
  );
}

export default StyleEditor;