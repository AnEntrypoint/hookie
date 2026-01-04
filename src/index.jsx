import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './admin/AdminApp.js';
import App from './public/App.js';
import { initializeDebugGlobals } from './lib/debuggingSetup.js';

window.React = React;
initializeDebugGlobals();

const isAdmin = window.location.pathname.includes('/admin');
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </React.StrictMode>
);