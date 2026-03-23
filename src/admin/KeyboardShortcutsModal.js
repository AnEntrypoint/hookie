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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 m-0">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer text-lg" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {KEYBOARD_SHORTCUTS.map((group) => (
            <div key={group.category} className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 m-0">{group.category}</h3>
              <div className="flex flex-col gap-2">
                {group.shortcuts.map((shortcut, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {shortcut.keys.map((key, keyIdx) => (
                        <React.Fragment key={keyIdx}>
                          {keyIdx > 0 && <span className="text-slate-400 text-xs"> / </span>}
                          <kbd className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 rounded shadow-[0_1px_0_rgba(0,0,0,0.2)] font-mono">
                            {key.replace('Cmd', isMac ? '⌘' : 'Cmd').replace('Ctrl', isMac ? '⌘' : 'Ctrl')}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="text-sm text-slate-600 flex-1 text-right">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500 m-0">Press <kbd className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 rounded shadow-[0_1px_0_rgba(0,0,0,0.2)] font-mono" style={{ fontSize: '0.75rem' }}>Esc</kbd> to close this dialog</p>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
