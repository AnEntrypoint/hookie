import React from 'react';
import PropsEditor from './PropsEditor.js';
import componentRegistry from '../lib/componentRegistry.js';
import { deepClone, findComponentById } from './builderHelpers.js';

export default function BuilderPropsPanel({ pageData, selectedComponentId, onUpdate, isMobile, isTablet, onShowMobileProps, styles }) {
  const component = selectedComponentId ? findComponentById(pageData, selectedComponentId) : null;
  const schema = component ? componentRegistry.getComponent(component.type) : null;

  const handleChange = (updatedProps) => {
    const newPageData = deepClone(pageData);
    const comp = findComponentById(newPageData, selectedComponentId);
    if (comp) { comp.props = updatedProps; onUpdate(newPageData); }
  };

  const panelStyle = isMobile ? styles.rightMobile : isTablet ? styles.rightTablet : styles.right;

  if (!selectedComponentId) {
    return (
      <div style={panelStyle}>
        <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>←</div>
          <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>No component selected</div>
          <div style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>Click a component on the canvas to edit its properties here</div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div style={panelStyle}>
        <button onClick={onShowMobileProps} style={{ width: '100%', padding: '12px 16px', fontSize: '16px', fontWeight: '600', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', minHeight: '44px' }}>
          Edit Properties
        </button>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <PropsEditor component={component} schema={schema} onChange={handleChange} isMobile={false} />
    </div>
  );
}
