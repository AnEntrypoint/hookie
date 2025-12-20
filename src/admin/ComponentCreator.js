import React from 'react';
import { contentManager } from './contentManager.js';

export function ComponentCreator(props = {}) {
  return (
    <div className="ComponentCreator" data-component="ComponentCreator">
      {children}
    </div>
  );
}

export default ComponentCreator;