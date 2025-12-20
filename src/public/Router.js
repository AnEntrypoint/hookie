import React from 'react';
import { Renderer } from '../Renderer.js';

export function Router(props = {}, children) {
  return (
    <div className="Router" data-component="Router">
      {children}
    </div>
  );
}

export default Router;