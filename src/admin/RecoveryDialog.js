import React, { useEffect, useRef } from 'react';

export default function RecoveryDialog({ recovery, onRecover, onDiscard }) {
  const recoverButtonRef = useRef(null);

  const formatAge = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onDiscard();
      if (e.key === 'Enter') onRecover();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onRecover, onDiscard]);

  useEffect(() => { recoverButtonRef.current?.focus(); }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog} role="dialog" aria-modal="true">
        <h2 style={styles.title}>Recover Unsaved Changes?</h2>
        <p style={styles.message}>Found auto-saved changes from:</p>
        <div style={styles.timestamp}>{recovery.formatted} ({formatAge(recovery.age)})</div>
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
          <button onClick={onDiscard} style={styles.secondaryButton}>Discard</button>
          <button ref={recoverButtonRef} onClick={onRecover} style={styles.primaryButton}>Recover Changes</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  dialog: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '480px', width: '90%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' },
  title: { margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', textAlign: 'center' },
  message: { margin: '0 0 8px 0', fontSize: '0.875rem', color: '#64748b', textAlign: 'center' },
  timestamp: { margin: '0 0 20px 0', fontSize: '0.875rem', fontWeight: '600', color: '#2563eb', textAlign: 'center' },
  preview: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' },
  stat: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' },
  label: { fontSize: '0.875rem', color: '#64748b', fontWeight: '500' },
  value: { fontSize: '0.875rem', color: '#1e293b', fontWeight: '700' },
  actions: { display: 'flex', gap: '12px' },
  primaryButton: { flex: 1, padding: '12px 24px', fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', minHeight: '44px' },
  secondaryButton: { flex: 1, padding: '12px 24px', fontSize: '0.875rem', fontWeight: '600', color: '#64748b', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', minHeight: '44px' },
};
