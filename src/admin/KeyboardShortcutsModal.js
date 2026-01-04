import React from 'react';

const KEYBOARD_SHORTCUTS = [
  {
    category: 'Editing',
    shortcuts: [
      { keys: ['Ctrl+Z', 'Cmd+Z'], description: 'Undo last change' },
      { keys: ['Ctrl+Shift+Z'], description: 'Redo action' },
      { keys: ['Delete'], description: 'Remove selected component' },
      { keys: ['Ctrl+D', 'Cmd+D'], description: 'Duplicate selected component' },
    ]
  },
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['Esc'], description: 'Deselect component' },
      { keys: ['Tab'], description: 'Move to next field' },
      { keys: ['Shift+Tab'], description: 'Move to previous field' },
    ]
  },
  {
    category: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Open keyboard shortcuts help' },
    ]
  }
];

export default function KeyboardShortcutsModal({ onClose }) {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  return (
    <div
      style={styles.overlay}
      onClick={onClose}
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={styles.content}>
          {KEYBOARD_SHORTCUTS.map((group) => (
            <div key={group.category} style={styles.group}>
              <h3 style={styles.groupTitle}>{group.category}</h3>
              <div style={styles.shortcutsList}>
                {group.shortcuts.map((shortcut, idx) => (
                  <div key={idx} style={styles.shortcutRow}>
                    <div style={styles.keysContainer}>
                      {shortcut.keys.map((key, keyIdx) => (
                        <React.Fragment key={keyIdx}>
                          {keyIdx > 0 && <span style={styles.orSeparator}> / </span>}
                          <kbd style={styles.kbd}>
                            {key.replace('Cmd', isMac ? '⌘' : 'Cmd').replace('Ctrl', isMac ? '⌘' : 'Ctrl')}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                    <span style={styles.description}>{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>Press <kbd style={{ ...styles.kbd, fontSize: '0.75rem' }}>Esc</kbd> to close this dialog</p>
          <button
            onClick={onClose}
            style={styles.closeButtonPrimary}
          >
            Close
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(2px)',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    backgroundColor: '#ffffff',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    minHeight: '36px',
    transition: 'color 0.15s',
  },
  content: {
    padding: '24px',
  },
  group: {
    marginBottom: '24px',
  },
  groupTitle: {
    margin: '0 0 12px 0',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  shortcutsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  shortcutRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    paddingBottom: '8px',
  },
  keysContainer: {
    minWidth: '120px',
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  orSeparator: {
    color: '#cbd5e1',
    fontSize: '0.875rem',
    fontWeight: '400',
  },
  kbd: {
    display: 'inline-block',
    padding: '4px 8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    lineHeight: '1',
    color: '#1e293b',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.05)',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  description: {
    fontSize: '0.875rem',
    color: '#64748b',
    flex: 1,
    lineHeight: '1.5',
  },
  footer: {
    padding: '16px 24px 24px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  closeButtonPrimary: {
    padding: '8px 20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    minHeight: '36px',
  },
};
