import React from 'react';

export default function RealGitHubTest({ children, ...props }) {
  return (
    <div {...props} style={{ padding: '12px', background: '#f0f0f0', borderRadius: '8px' }}>
      {children || 'Real GitHub Test Component'}
    </div>
  );
}