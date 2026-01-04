import React from 'react';

export default function PropEditor({ prop, index, onUpdate, onRemove, isMobile }) {
  const propTypes = ['string', 'number', 'boolean', 'array', 'object', 'node', 'function'];

  const containerStyle = isMobile ? getMobileContainerStyle() : getDesktopContainerStyle();
  const rowStyle = isMobile ? getMobileRowStyle() : getDesktopRowStyle();
  const fieldStyle = getFieldStyle(isMobile);
  const checkboxFieldStyle = isMobile ? getMobileCheckboxFieldStyle() : getDesktopCheckboxFieldStyle();

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <div style={fieldStyle}>
          <label style={getLabelStyle(isMobile)}>Prop Name</label>
          <input
            type="text"
            value={prop.name || ''}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            placeholder="propName (camelCase)"
            style={getInputStyle(isMobile)}
          />
        </div>

        <div style={fieldStyle}>
          <label style={getLabelStyle(isMobile)}>Type</label>
          <select
            value={prop.type || 'string'}
            onChange={(e) => onUpdate(index, 'type', e.target.value)}
            style={getSelectStyle(isMobile)}
          >
            {propTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={checkboxFieldStyle}>
          <label style={getCheckboxLabelStyle(isMobile)}>
            <input
              type="checkbox"
              checked={prop.required || false}
              onChange={(e) => onUpdate(index, 'required', e.target.checked)}
              style={getCheckboxStyle(isMobile)}
            />
            Required
          </label>
        </div>
      </div>

      <div style={rowStyle}>
        <div style={fieldStyle}>
          <label style={getLabelStyle(isMobile)}>Default Value</label>
          <input
            type="text"
            value={prop.default || ''}
            onChange={(e) => onUpdate(index, 'default', e.target.value)}
            placeholder={getDefaultPlaceholder(prop.type)}
            style={getInputStyle(isMobile)}
          />
        </div>

        {prop.type === 'string' && (
          <div style={fieldStyle}>
            <label style={getLabelStyle(isMobile)}>Options (comma-separated)</label>
            <input
              type="text"
              value={prop.options || ''}
              onChange={(e) => onUpdate(index, 'options', e.target.value)}
              placeholder="option1, option2, option3"
              style={getInputStyle(isMobile)}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => onRemove(index)}
          style={getRemoveButtonStyle(isMobile)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function getDefaultPlaceholder(type) {
  switch (type) {
    case 'number': return '0';
    case 'boolean': return 'true';
    case 'array': return '[]';
    case 'object': return '{}';
    default: return 'default value';
  }
}

const getMobileContainerStyle = () => ({
  padding: '16px',
  marginBottom: '16px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
});

const getDesktopContainerStyle = () => ({
  padding: '16px',
  marginBottom: '12px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
});

const getMobileRowStyle = () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '16px',
  alignItems: 'stretch',
});

const getDesktopRowStyle = () => ({
  display: 'flex',
  gap: '12px',
  marginBottom: '8px',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
});

const getFieldStyle = (isMobile) => ({
  flex: isMobile ? 'none' : '1',
  display: 'flex',
  flexDirection: 'column',
  width: isMobile ? '100%' : 'auto',
});

const getMobileCheckboxFieldStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '0',
  minHeight: '44px',
});

const getDesktopCheckboxFieldStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '8px',
});

const getLabelStyle = (isMobile) => ({
  fontSize: isMobile ? '16px' : '0.875rem',
  fontWeight: '600',
  color: '#64748b',
  marginBottom: isMobile ? '8px' : '4px',
  lineHeight: '1.4',
});

const getCheckboxLabelStyle = (isMobile) => ({
  fontSize: isMobile ? '16px' : '0.875rem',
  fontWeight: '600',
  color: '#64748b',
  display: 'flex',
  alignItems: 'center',
  gap: isMobile ? '12px' : '6px',
  cursor: 'pointer',
  userSelect: 'none',
});

const getInputStyle = (isMobile) => ({
  padding: isMobile ? '12px' : '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  fontSize: isMobile ? '16px' : '0.875rem',
  transition: 'border 150ms ease-in-out',
  minHeight: isMobile ? '44px' : 'auto',
  lineHeight: isMobile ? '1.5' : 'inherit',
});

const getSelectStyle = (isMobile) => ({
  padding: isMobile ? '12px' : '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  fontSize: isMobile ? '16px' : '0.875rem',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  minHeight: isMobile ? '44px' : 'auto',
  lineHeight: isMobile ? '1.5' : 'inherit',
});

const getCheckboxStyle = (isMobile) => ({
  width: isMobile ? '24px' : '16px',
  height: isMobile ? '24px' : '16px',
  cursor: 'pointer',
  minWidth: isMobile ? '24px' : '16px',
});

const getRemoveButtonStyle = (isMobile) => ({
  padding: isMobile ? '12px 16px' : '8px 16px',
  backgroundColor: 'transparent',
  color: '#ef4444',
  border: '1px solid #fecaca',
  borderRadius: '6px',
  fontSize: isMobile ? '16px' : '0.875rem',
  cursor: 'pointer',
  transition: 'all 150ms ease-in-out',
  minHeight: isMobile ? '44px' : 'auto',
  fontWeight: '600',
  lineHeight: '1.4',
});
