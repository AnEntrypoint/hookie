import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './admin/AdminApp.js';
import App from './public/App.js';
import { initializeDebugGlobals } from './lib/debuggingSetup.js';

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);

window.React = React;
initializeDebugGlobals();

const isAdmin = window.location.pathname.includes('/admin');
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </React.StrictMode>
);