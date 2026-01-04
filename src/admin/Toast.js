import React, { useEffect, useState } from 'react';
import { colors, spacing, transitions, borderRadius, shadows } from '../theme';

const toastStyles = {
  success: {
    background: '#d1fae5',
    text: '#065f46',
    icon: '✓',
  },
  info: {
    background: '#dbeafe',
    text: '#1e40af',
    icon: 'ℹ',
  },
  warning: {
    background: '#fef3c7',
    text: '#92400e',
    icon: '⚠',
  },
  error: {
    background: '#fef2f2',
    text: '#991b1b',
    icon: '✕',
  },
};

function Toast({ id, message, type = 'info', onClose, duration = 4000 }) {
  const [isExiting, setIsExiting] = useState(false);
  const style = toastStyles[type] || toastStyles.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 200);
  };

  return (
    <div
      style={{
        ...styles.toast(style, isExiting),
        animation: isExiting
          ? 'toastExit 200ms ease-in-out forwards'
          : 'toastEnter 300ms ease-out forwards',
      }}
    >
      <div style={styles.toastContent}>
        <span style={{ ...styles.icon, color: style.text }}>
          {style.icon}
        </span>
        <span style={{ ...styles.message, color: style.text }}>
          {message}
        </span>
      </div>
      <button
        onClick={handleClose}
        style={{ ...styles.closeButton, color: style.text }}
      >
        ×
      </button>
    </div>
  );
}

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  React.useEffect(() => {
    window.toastManager = { showToast };
  }, []);

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </>
  );
}

const keyframes = `
  @keyframes toastEnter {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes toastExit {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
`;

const styles = {
  container: {
    position: 'fixed',
    bottom: spacing.base,
    right: spacing.base,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    maxWidth: '400px',
    minWidth: '300px',
    pointerEvents: 'none',
  },
  toast: (style, isExiting) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.base} ${spacing.lg}`,
    backgroundColor: style.background,
    borderRadius: borderRadius.md,
    boxShadow: shadows.large,
    pointerEvents: 'auto',
    cursor: 'pointer',
  }),
  toastContent: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  icon: {
    fontSize: '1.25rem',
    fontWeight: '600',
    flexShrink: 0,
  },
  message: {
    fontSize: '0.95rem',
    fontWeight: '500',
    lineHeight: 1.5,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    padding: '0',
    marginLeft: spacing.md,
    cursor: 'pointer',
    transition: `opacity ${transitions.fast}`,
    flexShrink: 0,
  },
};

export { Toast, ToastContainer };

export function useToast() {
  return {
    showToast: (message, type = 'info', duration = 4000) => {
      if (window.toastManager) {
        window.toastManager.showToast(message, type, duration);
      }
    },
  };
}
