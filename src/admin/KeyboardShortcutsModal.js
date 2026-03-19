import React from 'react';
import { styles } from './keyboardShortcutsStyles';

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
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Keyboard Shortcuts</h2>
          <button onClick={onClose} style={styles.closeButton} aria-label="Close">
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
          <button onClick={onClose} style={styles.closeButtonPrimary}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
