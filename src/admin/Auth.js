import React from 'react';
import { github } from './github.js';

export function Auth(props = {}, children) {
  return (
    <div className="Auth" data-component="Auth">
      {children}
    </div>
  );
}

export default Auth;