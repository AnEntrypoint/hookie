import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './admin/AdminApp.js';
import App from './public/App.js';

// Determine if we should show admin or public site
const isAdmin = window.location.pathname.includes('/admin');

// Render appropriate app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </React.StrictMode>
);
