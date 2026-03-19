import React from 'react';
import {
  getMobileContainerStyle, getDesktopContainerStyle,
  getMobileRowStyle, getDesktopRowStyle,
  getFieldStyle, getMobileCheckboxFieldStyle, getDesktopCheckboxFieldStyle,
  getLabelStyle, getCheckboxLabelStyle,
  getInputStyle, getSelectStyle, getCheckboxStyle,
  getRemoveButtonStyle,
} from './propEditorStyles';

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
