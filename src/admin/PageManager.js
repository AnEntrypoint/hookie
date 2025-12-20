import React from 'react';
import { contentManager } from '../lib/contentManager.js';

export function PageManager(props = {}, children) {
  return (
    <div className="PageManager" data-component="PageManager">
      {children}
    </div>
  );
}

export default PageManager;