import React from 'react';

export default function TypographyTab({ style, onChange }) {
  const handleChange = (property, value) => {
    onChange({ ...style, [property]: value });
  };

  const parseValue = (value, defaultVal = 16) => {
    if (!value) return defaultVal;
    return parseInt(value) || defaultVal;
  };

  return (
    <div style={styles.container}>
      <div style={styles.field}>
        <label style={styles.label}>Font Size</label>
        <div style={styles.sliderGroup}>
          <input
            type="range"
            min="8"
            max="72"
            value={parseValue(style.fontSize, 16)}
            onChange={(e) => handleChange('fontSize', `${e.target.value}px`)}
            style={styles.slider}
          />
          <input
            type="text"
            value={style.fontSize || '16px'}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            style={styles.textInput}
          />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Font Weight</label>
        <select
          value={style.fontWeight || 'normal'}
          onChange={(e) => handleChange('fontWeight', e.target.value)}
          style={styles.select}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
          <option value="800">800</option>
          <option value="900">900</option>
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Line Height</label>
        <div style={styles.sliderGroup}>
          <input
            type="range"
            min="0.8"
            max="3"
            step="0.1"
            value={parseFloat(style.lineHeight) || 1.5}
            onChange={(e) => handleChange('lineHeight', e.target.value)}
            style={styles.slider}
          />
          <input
            type="text"
            value={style.lineHeight || '1.5'}
            onChange={(e) => handleChange('lineHeight', e.target.value)}
            style={styles.textInput}
          />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Letter Spacing</label>
        <div style={styles.sliderGroup}>
          <input
            type="range"
            min="-2"
            max="10"
            value={parseValue(style.letterSpacing, 0)}
            onChange={(e) => handleChange('letterSpacing', `${e.target.value}px`)}
            style={styles.slider}
          />
          <input
            type="text"
            value={style.letterSpacing || '0px'}
            onChange={(e) => handleChange('letterSpacing', e.target.value)}
            style={styles.textInput}
          />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Text Align</label>
        <div style={styles.buttonGroup}>
          {['left', 'center', 'right', 'justify'].map(align => (
            <button
              key={align}
              onClick={() => handleChange('textAlign', align)}
              style={{
                ...styles.button,
                ...(style.textAlign === align ? styles.buttonActive : {}),
              }}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Text Transform</label>
        <select
          value={style.textTransform || 'none'}
          onChange={(e) => handleChange('textTransform', e.target.value)}
          style={styles.select}
        >
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Text Decoration</label>
        <select
          value={style.textDecoration || 'none'}
          onChange={(e) => handleChange('textDecoration', e.target.value)}
          style={styles.select}
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="line-through">Line Through</option>
        </select>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.875rem', fontWeight: '500', color: '#64748b' },
  sliderGroup: { display: 'flex', gap: '12px', alignItems: 'center' },
  slider: { flex: 1 },
  textInput: { width: '80px', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem' },
  select: { padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#ffffff' },
  buttonGroup: { display: 'flex', gap: '6px' },
  button: { flex: 1, padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '0.875rem' },
  buttonActive: { backgroundColor: '#dbeafe', borderColor: '#2563eb', color: '#2563eb' },
};
