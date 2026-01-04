import React, { useEffect, useRef } from 'react';

/**
 * RecoveryDialog
 *
 * Modal dialog for recovering auto-saved changes after crash/refresh.
 * Shows when unsaved changes are detected in localStorage.
 */
export default function RecoveryDialog({ recovery, onRecover, onDiscard, onClose }) {
  const recoverButtonRef = useRef(null);

  // Format age to human-readable string
  const formatAge = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onDiscard(); // Escape = discard
      }
      if (e.key === 'Enter') {
        onRecover(); // Enter = recover (primary action)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRecover, onDiscard]);

  // Focus management
  useEffect(() => {
    // Focus primary button on mount
    recoverButtonRef.current?.focus();
  }, []);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="recovery-title"
        aria-describedby="recovery-message"
        aria-modal="true"
      >
        <h2 id="recovery-title" style={styles.title}>
          Recover Unsaved Changes?
        </h2>

        <p id="recovery-message" style={styles.message}>
          Found auto-saved changes from:
        </p>

        <div style={styles.timestamp}>
          {recovery.formatted} ({formatAge(recovery.age)})
        </div>

        <div style={styles.preview}>
          <div style={styles.stat}>
            <span style={styles.label}>Components:</span>
            <span style={styles.value}>{recovery.pageData.components?.length || 0}</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.label}>Last saved:</span>
            <span style={styles.value}>{formatAge(recovery.age)}</span>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={onDiscard} style={styles.secondaryButton}>
            Discard & Start Fresh
          </button>
          <button
            ref={recoverButtonRef}
            onClick={onRecover}
            style={styles.primaryButton}
          >
            Recover Changes
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(4px)',
  },
  dialog: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  message: {
    margin: '0 0 8px 0',
    fontSize: '0.875rem',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  timestamp: {
    margin: '0 0 24px 0',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#2563eb',
    textAlign: 'center',
  },
  preview: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  label: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500',
  },
  value: {
    fontSize: '0.875rem',
    color: '#1e293b',
    fontWeight: '700',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'stretch',
  },
  primaryButton: {
    flex: 1,
    padding: '12px 24px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    minHeight: '44px',
  },
  secondaryButton: {
    flex: 1,
    padding: '12px 24px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: '44px',
  },
};
