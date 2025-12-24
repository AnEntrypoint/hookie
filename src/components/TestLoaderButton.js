import React from 'react';
export default function TestLoaderButton({ label = 'Test Button', ...props }) {
  return (
    <button {...props} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
      {label}
    </button>
  );
}