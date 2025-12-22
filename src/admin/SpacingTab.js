import React, { useState } from 'react';

export default function SpacingTab({ style, onChange }) {
  const [linkedMargin, setLinkedMargin] = useState(true);
  const [linkedPadding, setLinkedPadding] = useState(true);

  const handleChange = (property, value) => {
    onChange({ ...style, [property]: value });
  };

  const handleLinkedChange = (baseProperty, value) => {
    const updates = {
      [`${baseProperty}Top`]: value,
      [`${baseProperty}Right`]: value,
      [`${baseProperty}Bottom`]: value,
      [`${baseProperty}Left`]: value,
    };
    onChange({ ...style, ...updates });
  };

  const parseValue = (value) => {
    if (!value) return 0;
    return parseInt(value) || 0;
  };

  return (
    <div style={styles.container}>
      <section style={styles.section}>
        <h4 style={styles.heading}>Margin</h4>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={linkedMargin}
            onChange={(e) => setLinkedMargin(e.target.checked)}
            style={styles.checkbox}
          />
          Link all sides
        </label>

        {linkedMargin ? (
          <div style={styles.field}>
            <label style={styles.label}>All Sides</label>
            <div style={styles.sliderGroup}>
              <input
                type="range"
                min="0"
                max="100"
                value={parseValue(style.margin)}
                onChange={(e) => handleLinkedChange('margin', `${e.target.value}px`)}
                style={styles.slider}
              />
              <input
                type="text"
                value={style.margin || '0px'}
                onChange={(e) => handleLinkedChange('margin', e.target.value)}
                style={styles.textInput}
              />
            </div>
          </div>
        ) : (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Top</label>
              <input
                type="text"
                value={style.marginTop || '0px'}
                onChange={(e) => handleChange('marginTop', e.target.value)}
                style={styles.textInput}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Right</label>
              <input
                type="text"
                value={style.marginRight || '0px'}
                onChange={(e) => handleChange('marginRight', e.target.value)}
                style={styles.textInput}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Bottom</label>
              <input
                type="text"
                value={style.marginBottom || '0px'}
                onChange={(e) => handleChange('marginBottom', e.target.value)}
                style={styles.textInput}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Left</label>
              <input
                type="text"
                value={style.marginLeft || '0px'}
                onChange={(e) => handleChange('marginLeft', e.target.value)}
                style={styles.textInput}
              />
            </div>
          </>
        )}
      </section>

      <section style={styles.section}>
        <h4 style={styles.heading}>Padding</h4>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={linkedPadding}
            onChange={(e) => setLinkedPadding(e.target.checked)}
            style={styles.checkbox}
          />
          Link all sides
        </label>

        {linkedPadding ? (
          <div style={styles.field}>
            <label style={styles.label}>All Sides</label>
            <div style={styles.sliderGroup}>
              <input
                type="range"
                min="0"
                max="100"
                value={parseValue(style.padding)}
                onChange={(e) => handleLinkedChange('padding', `${e.target.value}px`)}
                style={styles.slider}
              />
              <input
                type="text"
                value={style.padding || '0px'}
                onChange={(e) => handleLinkedChange('padding', e.target.value)}
                style={styles.textInput}
              />
            </div>
          </div>
        ) : (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Top</label>
              <input
                type="text"
                value={style.paddingTop || '0px'}
                onChange={(e) => handleChange('paddingTop', e.target.value)}
                style={styles.textInput}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Right</label>
              <input
                type="text"
                value={style.paddingRight || '0px'}
                onChange={(e) => handleChange('paddingRight', e.target.value)}
                style={styles.textInput}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Bottom</label>
              <input
                type="text"
                value={style.paddingBottom || '0px'}
                onChange={(e) => handleChange('paddingBottom', e.target.value)}
                style={styles.textInput}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Left</label>
              <input
                type="text"
                value={style.paddingLeft || '0px'}
                onChange={(e) => handleChange('paddingLeft', e.target.value)}
                style={styles.textInput}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  section: { display: 'flex', flexDirection: 'column', gap: '12px' },
  heading: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', margin: 0 },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.875rem', fontWeight: '500', color: '#64748b' },
  checkboxLabel: { fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' },
  checkbox: { width: '16px', height: '16px', cursor: 'pointer' },
  sliderGroup: { display: 'flex', gap: '12px', alignItems: 'center' },
  slider: { flex: 1 },
  textInput: { width: '80px', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem' },
};
