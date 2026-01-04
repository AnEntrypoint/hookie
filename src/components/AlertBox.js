import React from 'react';

const AlertBox = ({
  type = 'info',
  title = '',
  message = '',
  onClose = null,
  style = {}
}) => {
  const typeStyles = {
    info: {
      backgroundColor: '#dbeafe',
      borderColor: '#93c5fd',
      color: '#1e40af',
      iconColor: '#2563eb'
    },
    warning: {
      backgroundColor: '#fef3c7',
      borderColor: '#fde68a',
      color: '#92400e',
      iconColor: '#f59e0b'
    },
    error: {
      backgroundColor: '#fee2e2',
      borderColor: '#fecaca',
      color: '#991b1b',
      iconColor: '#ef4444'
    },
    success: {
      backgroundColor: '#dcfce7',
      borderColor: '#bbf7d0',
      color: '#166534',
      iconColor: '#10b981'
    }
  };

  const colors = typeStyles[type] || typeStyles.info;

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✓'
  };

  const alertStyle = {
    padding: '16px',
    marginBottom: '16px',
    border: `2px solid ${colors.borderColor}`,
    borderRadius: '8px',
    backgroundColor: colors.backgroundColor,
    color: colors.color,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    ...style
  };

  return (
    <div style={alertStyle} role="alert">
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>
          {icons[type]}
        </span>
        <div style={{ flex: 1 }}>
          {title && (
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {title}
            </div>
          )}
          {message && (
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              {message}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: colors.color,
              cursor: 'pointer',
              fontSize: '1.25rem',
              padding: 0,
              flexShrink: 0
            }}
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBox;
