import React from 'react';
import { componentRegistry } from '../componentRegistry.js';

export function Renderer(props = {}, children) {
  return (
    <div className="Renderer" data-component="Renderer">
      {children}
    </div>
  );
}

export default Renderer;