import React from 'react';
import { componentRegistry } from '../lib/componentRegistry.js';

export function PropsEditor(props = {}, children) {
  return (
    <div className="PropsEditor" data-component="PropsEditor">
      {children}
    </div>
  );
}

export default PropsEditor;