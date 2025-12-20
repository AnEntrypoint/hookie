import React from 'react';
import { github } from './github.js';

export function PublishManager(props = {}, children) {
  return (
    <div className="PublishManager" data-component="PublishManager">
      {children}
    </div>
  );
}

export default PublishManager;