import React, { useState, useEffect } from 'react';
import * as github from '../lib/github';
import { HeaderTab, FooterTab, ColorsTab, TypographyTab } from './LayoutEditorTabs';

export default function LayoutEditor({ owner, repo }) {
  const [layout, setLayout] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('header');

  useEffect(() => {
    loadLayout();
  }, [owner, repo]);

  const loadLayout = async () => {
    try {
      const data = await github.readFile(owner, repo, 'content/layout.json');
      const layoutData = JSON.parse(data.content);
      setLayout(layoutData);
      setError(null);
    } catch (err) {
      setError('Failed to load layout: ' + err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const content = JSON.stringify(layout, null, 2);
      await github.writeFile(
        owner, repo, 'content/layout.json',
        content, 'Update site layout'
      );
      setSuccess('Layout saved successfully!');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save layout: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path, value) => {
    const keys = path.split('.');
    setLayout(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (!layout) {
    return <div style={styles.loading}>Loading layout...</div>;
  }

  const tabs = [
    { id: 'header', label: 'Header', Component: HeaderTab },
    { id: 'footer', label: 'Footer', Component: FooterTab },
    { id: 'colors', label: 'Colors', Component: ColorsTab },
    { id: 'typography', label: 'Typography', Component: TypographyTab },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Site Layout Editor</h2>
        <p style={styles.subtitle}>Edit your site's layout, colors, and typography</p>
      </div>

      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : {})
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {tabs.find(t => t.id === activeTab)?.Component &&
          React.createElement(tabs.find(t => t.id === activeTab).Component, {
            layout,
            updateField,
            styles,
          })}
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.footer}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={styles.saveButton}
        >
          {saving ? 'Saving...' : 'Save Layout'}
        </button>
        <button
          onClick={loadLayout}
          disabled={saving}
          style={styles.resetButton}
        >
          Reload
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '24px', maxWidth: '500px', margin: '0 auto' },
  header: { marginBottom: '32px' },
  title: { margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b' },
  subtitle: { margin: '0', fontSize: '14px', color: '#64748b' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0' },
  tab: { padding: '12px 16px', background: 'none', border: 'none', borderBottom: '2px solid transparent', color: '#64748b', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 150ms' },
  tabActive: { color: '#2563eb', borderBottomColor: '#2563eb' },
  content: { marginBottom: '24px' },
  section: { marginBottom: '24px' },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#1e293b' },
  checkbox: { marginRight: '8px', cursor: 'pointer' },
  input: { width: '100%', padding: '8px 12px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'inherit' },
  colorInput: { width: '60px', height: '40px', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' },
  colorRow: { display: 'flex', gap: '8px', alignItems: 'center' },
  error: { padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' },
  success: { padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' },
  footer: { display: 'flex', gap: '12px' },
  saveButton: { flex: 1, padding: '12px 24px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 150ms' },
  resetButton: { flex: 1, padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 150ms' },
  loading: { padding: '48px 24px', textAlign: 'center', color: '#64748b', fontSize: '16px' },
};
