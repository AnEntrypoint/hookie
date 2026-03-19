import React from 'react';
import { styles } from './componentCreatorStyles';

export default function ChildrenRulesSection({ allowedChildren, onChange }) {
  return (
    <section style={styles.section}>
      <h3 style={styles.sectionHeading}>Children Rules</h3>

      <div style={styles.radioGroup}>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="all"
            checked={allowedChildren === 'all'}
            onChange={(e) => onChange(e.target.value)}
            style={styles.radio}
          />
          Allow all child types
        </label>

        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="none"
            checked={allowedChildren === 'none'}
            onChange={(e) => onChange(e.target.value)}
            style={styles.radio}
          />
          No children allowed
        </label>

        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="specific"
            checked={allowedChildren === 'specific'}
            onChange={(e) => onChange(e.target.value)}
            style={styles.radio}
          />
          Specific children only
        </label>
      </div>
    </section>
  );
}
