function HeaderTab({ layout, updateField, styles }) {
  return (
    <section style={styles.section}>
      <h3>Header Settings</h3>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={layout.header.enabled}
            onChange={(e) => updateField('header.enabled', e.target.checked)}
            style={styles.checkbox}
          />
          Enable Header
        </label>
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Height (px)</label>
        <input
          type="number"
          value={layout.header.height}
          onChange={(e) => updateField('header.height', parseInt(e.target.value))}
          style={styles.input}
        />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Background Color</label>
        <div style={styles.colorRow}>
          <input
            type="color"
            value={layout.header.backgroundColor}
            onChange={(e) => updateField('header.backgroundColor', e.target.value)}
            style={styles.colorInput}
          />
          <input
            type="text"
            value={layout.header.backgroundColor}
            onChange={(e) => updateField('header.backgroundColor', e.target.value)}
            style={styles.input}
            placeholder="#ffffff"
          />
        </div>
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Border Bottom</label>
        <input
          type="text"
          value={layout.header.borderBottom}
          onChange={(e) => updateField('header.borderBottom', e.target.value)}
          style={styles.input}
          placeholder="1px solid #e0e0e0"
        />
      </div>
    </section>
  );
}

function FooterTab({ layout, updateField, styles }) {
  return (
    <section style={styles.section}>
      <h3>Footer Settings</h3>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={layout.footer.enabled}
            onChange={(e) => updateField('footer.enabled', e.target.checked)}
            style={styles.checkbox}
          />
          Enable Footer
        </label>
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Height (px)</label>
        <input
          type="number"
          value={layout.footer.height}
          onChange={(e) => updateField('footer.height', parseInt(e.target.value))}
          style={styles.input}
        />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Background Color</label>
        <div style={styles.colorRow}>
          <input
            type="color"
            value={layout.footer.backgroundColor}
            onChange={(e) => updateField('footer.backgroundColor', e.target.value)}
            style={styles.colorInput}
          />
          <input
            type="text"
            value={layout.footer.backgroundColor}
            onChange={(e) => updateField('footer.backgroundColor', e.target.value)}
            style={styles.input}
          />
        </div>
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Border Top</label>
        <input
          type="text"
          value={layout.footer.borderTop}
          onChange={(e) => updateField('footer.borderTop', e.target.value)}
          style={styles.input}
          placeholder="1px solid #e0e0e0"
        />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Content</label>
        <input
          type="text"
          value={layout.footer.content}
          onChange={(e) => updateField('footer.content', e.target.value)}
          style={styles.input}
        />
      </div>
    </section>
  );
}

function ColorsTab({ layout, updateField, styles }) {
  return (
    <section style={styles.section}>
      <h3>Theme Colors</h3>
      {Object.entries(layout.colors).map(([key, value]) => (
        <div key={key} style={styles.fieldGroup}>
          <label style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
          <div style={styles.colorRow}>
            <input
              type="color"
              value={value}
              onChange={(e) => updateField(`colors.${key}`, e.target.value)}
              style={styles.colorInput}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => updateField(`colors.${key}`, e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
      ))}
    </section>
  );
}

function TypographyTab({ layout, updateField, styles }) {
  return (
    <section style={styles.section}>
      <h3>Typography</h3>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Font Family</label>
        <input
          type="text"
          value={layout.typography.fontFamily}
          onChange={(e) => updateField('typography.fontFamily', e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Base Font Size (px)</label>
        <input
          type="number"
          value={layout.typography.fontSize.base}
          onChange={(e) => updateField('typography.fontSize.base', parseInt(e.target.value))}
          style={styles.input}
        />
      </div>
    </section>
  );
}

export { HeaderTab, FooterTab, ColorsTab, TypographyTab };
