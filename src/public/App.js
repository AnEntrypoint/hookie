import React from 'react';
import { Router } from '../Router.js';

export function App(props = {}, children) {
  return (
    <div className="App" data-component="App">
      {children}
    </div>
  );
}

export default App;