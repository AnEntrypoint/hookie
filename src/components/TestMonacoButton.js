import React from 'react';

export default function TestMonacoButton({ label = 'Click me', ...props }) {
  return (
    <button {...props} style={{ padding: '10px 20px', fontSize: '16px' }}>
      {label}
    </button>
  );
}