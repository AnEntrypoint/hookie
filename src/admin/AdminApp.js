import React from 'react';
import { Auth } from './Auth.js';

export function AdminApp(props = {}, children) {
  return (
    <div className="AdminApp" data-component="AdminApp">
      {children}
    </div>
  );
}

export default AdminApp;