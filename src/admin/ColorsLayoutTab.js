import React from 'react';
import { styles } from './colorsLayoutTabStyles';

export function ColorsTab({ style, onChange }) {
  const handleChange = (property, value) => {
    onChange({ ...style, [property]: value });
  };

  return (
    <div style={styles.container}>
      <div style={styles.field}>
        <label style={styles.label}>Text Color</label>
        <div style={styles.colorGroup}>
          <input
            type="color"
            value={style.color || '#000000'}
            onChange={(e) => handleChange('color', e.target.value)}
            style={styles.colorPicker}
          />
          <input
            type="text"
            value={style.color || '#000000'}
            onChange={(e) => handleChange('color', e.target.value)}
            placeholder="#000000"
            style={styles.textInput}
          />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Background</label>
        <div style={styles.colorGroup}>
          <input
            type="color"
            value={style.backgroundColor || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            style={styles.colorPicker}
          />
          <input
            type="text"
            value={style.backgroundColor || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            placeholder="#ffffff"
            style={styles.textInput}
          />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Border Color</label>
        <div style={styles.colorGroup}>
          <input
            type="color"
            value={style.borderColor || '#e2e8f0'}
            onChange={(e) => handleChange('borderColor', e.target.value)}
            style={styles.colorPicker}
          />
          <input
            type="text"
            value={style.borderColor || '#e2e8f0'}
            onChange={(e) => handleChange('borderColor', e.target.value)}
            placeholder="#e2e8f0"
            style={styles.textInput}
          />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Opacity</label>
        <div style={styles.sliderGroup}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={style.opacity || 1}
            onChange={(e) => handleChange('opacity', e.target.value)}
            style={styles.slider}
          />
          <span style={styles.value}>{style.opacity || 1}</span>
        </div>
      </div>
    </div>
  );
}

export function LayoutTab({ style, onChange }) {
  const handleChange = (property, value) => {
    onChange({ ...style, [property]: value });
  };

  const isFlexbox = style.display === 'flex';
  const isGrid = style.display === 'grid';

  return (
    <div style={styles.container}>
      <div style={styles.field}>
        <label style={styles.label}>Display</label>
        <select
          value={style.display || 'block'}
          onChange={(e) => handleChange('display', e.target.value)}
          style={styles.select}
        >
          <option value="block">Block</option>
          <option value="inline-block">Inline Block</option>
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
          <option value="none">None</option>
        </select>
      </div>

      {isFlexbox && (
        <>
          <div style={styles.field}>
            <label style={styles.label}>Flex Direction</label>
            <select
              value={style.flexDirection || 'row'}
              onChange={(e) => handleChange('flexDirection', e.target.value)}
              style={styles.select}
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
              <option value="row-reverse">Row Reverse</option>
              <option value="column-reverse">Column Reverse</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Justify Content</label>
            <select
              value={style.justifyContent || 'flex-start'}
              onChange={(e) => handleChange('justifyContent', e.target.value)}
              style={styles.select}
            >
              <option value="flex-start">Flex Start</option>
              <option value="center">Center</option>
              <option value="flex-end">Flex End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Align Items</label>
            <select
              value={style.alignItems || 'stretch'}
              onChange={(e) => handleChange('alignItems', e.target.value)}
              style={styles.select}
            >
              <option value="flex-start">Flex Start</option>
              <option value="center">Center</option>
              <option value="flex-end">Flex End</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>
        </>
      )}

      <div style={styles.field}>
        <label style={styles.label}>Width</label>
        <input
          type="text"
          value={style.width || 'auto'}
          onChange={(e) => handleChange('width', e.target.value)}
          placeholder="auto, 100px, 50%"
          style={styles.textInput}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Height</label>
        <input
          type="text"
          value={style.height || 'auto'}
          onChange={(e) => handleChange('height', e.target.value)}
          placeholder="auto, 100px, 50%"
          style={styles.textInput}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Position</label>
        <select
          value={style.position || 'static'}
          onChange={(e) => handleChange('position', e.target.value)}
          style={styles.select}
        >
          <option value="static">Static</option>
          <option value="relative">Relative</option>
          <option value="absolute">Absolute</option>
          <option value="fixed">Fixed</option>
          <option value="sticky">Sticky</option>
        </select>
      </div>
    </div>
  );
}
