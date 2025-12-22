// StyleEditor.js - Main tabbed interface for style editing
import React, { useState } from 'react';
import SpacingTab from './SpacingTab';
import TypographyTab from './TypographyTab';
import { ColorsTab, LayoutTab } from './ColorsLayoutTab';

export default function StyleEditor({ style, onChange }) {
  const [activeTab, setActiveTab] = useState('spacing');
  const [localStyle, setLocalStyle] = useState(style || {});

  const handleStyleChange = (updatedStyle) => {
    // Clean up undefined/null values
    const cleaned = {};
    for (const [key, value] of Object.entries(updatedStyle)) {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
      }
    }
    
    setLocalStyle(cleaned);
    onChange(cleaned);
  };

  const applyPreset = (preset) => {
    const presets = {
      fullWidth: { width: '100%' },
      center: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      card: { padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
      reset: {},
    };

    handleStyleChange({ ...localStyle, ...presets[preset] });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Style Editor</h3>

      <div style={styles.tabs}>
        {['spacing', 'typography', 'colors', 'layout'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === 'spacing' && (
          <SpacingTab style={localStyle} onChange={handleStyleChange} />
        )}
        {activeTab === 'typography' && (
          <TypographyTab style={localStyle} onChange={handleStyleChange} />
        )}
        {activeTab === 'colors' && (
          <ColorsTab style={localStyle} onChange={handleStyleChange} />
        )}
        {activeTab === 'layout' && (
          <LayoutTab style={localStyle} onChange={handleStyleChange} />
        )}
      </div>

      <div style={styles.utilities}>
        <h4 style={styles.utilitiesHeading}>Quick Utilities</h4>
        <div style={styles.utilityButtons}>
          <button onClick={() => applyPreset('fullWidth')} style={styles.utilityButton}>
            Full Width
          </button>
          <button onClick={() => applyPreset('center')} style={styles.utilityButton}>
            Center (Flex)
          </button>
          <button onClick={() => applyPreset('card')} style={styles.utilityButton}>
            Card Style
          </button>
          <button onClick={() => applyPreset('reset')} style={styles.resetButton}>
            Reset Styles
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' },
  heading: { fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 },
  tabs: { display: 'flex', gap: '4px', borderBottom: '1px solid #e2e8f0' },
  tab: { flex: 1, padding: '8px 12px', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', fontSize: '0.875rem', color: '#64748b', fontWeight: '500', transition: 'all 150ms' },
  tabActive: { borderBottomColor: '#2563eb', color: '#2563eb' },
  content: { minHeight: '200px' },
  utilities: { display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' },
  utilitiesHeading: { fontSize: '0.875rem', fontWeight: '600', color: '#1e293b', margin: 0 },
  utilityButtons: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' },
  utilityButton: { padding: '8px 12px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', color: '#64748b', fontWeight: '500' },
  resetButton: { gridColumn: 'span 2', padding: '8px 12px', backgroundColor: 'transparent', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', color: '#ef4444', fontWeight: '500' },
};
