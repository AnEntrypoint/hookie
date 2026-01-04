import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

const defaultTemplate = (componentName = 'MyComponent') => `export default function ${componentName}({ children, ...props }) {
  return React.createElement(
    'div',
    props,
    children
  );
}`;

const editorOptions = {
  minimap: { enabled: false },
  lineNumbers: 'on',
  wordWrap: 'on',
  formatOnSave: true,
  automaticLayout: true,
  fontSize: 13,
  fontFamily: 'Fira Code, monospace',
  tabSize: 2
};

export default function CodeEditor({ value, onChange, componentName = 'MyComponent', placeholder = null }) {
  const editorRef = useRef(null);

  const handleEditorChange = (val) => {
    onChange?.(val);
  };

  const handleMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.label}>Component Code</h3>
        <div style={styles.helperText}>Write your React component JSX here</div>
      </div>

      <div style={styles.editorWrapper}>
        <Editor
          height="400px"
          defaultLanguage="javascript"
          value={value || placeholder || defaultTemplate(componentName)}
          onChange={handleEditorChange}
          onMount={handleMount}
          options={editorOptions}
          theme="light"
        />
      </div>

      <div style={styles.hint}>
        💡 Must export default function. Use React.createElement() not JSX. React is available globally.
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '24px',
    marginBottom: '24px'
  },
  header: {
    marginBottom: '12px'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 6px 0'
  },
  helperText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '8px'
  },
  editorWrapper: {
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  hint: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '8px',
    fontStyle: 'italic'
  }
};
