import React from 'react';

const ChangesList = ({ changes, expandedDiffs, onToggleDiff }) => {
  if (!changes || changes.length === 0) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'added':
        return { bg: '#dcfce7', color: '#166534' };
      case 'modified':
        return { bg: '#fef08a', color: '#854d0e' };
      case 'deleted':
        return { bg: '#fee2e2', color: '#991b1b' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{
      padding: '32px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      marginBottom: '32px',
      background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        Changed Files
        <span style={{
          background: '#2563eb',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          {changes.length}
        </span>
      </h3>

      {changes.map((change, index) => {
        const statusColors = getStatusColor(change.status);
        const isExpanded = expandedDiffs.has(change.path);

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              border: '2px solid transparent',
              borderRadius: '12px',
              background: '#f8fafc',
              marginBottom: index < changes.length - 1 ? '16px' : '0',
              cursor: change.diff ? 'pointer' : 'default',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => change.diff && onToggleDiff(change.path)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
                background: statusColors.bg,
                color: statusColors.color
              }}>
                {change.status}
              </span>
              <code style={{
                fontSize: '0.875rem',
                color: '#1e293b',
                fontFamily: 'monospace'
              }}>
                {change.path}
              </code>
            </div>

            {change.diff && isExpanded && (
              <pre style={{
                marginTop: '16px',
                padding: '12px',
                background: '#1e293b',
                color: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '0.75rem',
                overflowX: 'auto',
                fontFamily: 'monospace'
              }}>
                {change.diff}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChangesList;
