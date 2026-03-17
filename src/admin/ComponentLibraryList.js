import React from 'react';
import { styles } from './componentLibraryStyles.js';

export default function ComponentLibraryList({ components, selectedComponent, onSelect, searchQuery, onSearchChange, filterType, onFilterChange, isMobile }) {
  return (
    <div style={{ backgroundColor: '#ffffff', overflowY: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: isMobile ? '12px' : '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ ...styles.searchInput, width: '100%', boxSizing: 'border-box' }}
        />
        <select value={filterType} onChange={(e) => onFilterChange(e.target.value)} style={{ ...styles.filterSelect, width: '100%' }}>
          <option value="all">All Components</option>
          <option value="builtin">Built-in Only</option>
          <option value="custom">Custom Only</option>
        </select>
      </div>

      <div style={styles.componentsList}>
        {components.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
            No components match your search
          </div>
        )}
        {components.map((comp) => (
          <div
            key={comp.name}
            onClick={() => onSelect(comp)}
            style={{ ...styles.componentCard, ...(selectedComponent?.name === comp.name ? styles.componentCardActive : {}) }}
          >
            <div style={styles.cardHeader}>
              <span style={{ fontSize: '1.25rem' }}>{comp.icon || '□'}</span>
              <h3 style={styles.componentName}>{comp.name}</h3>
              {comp.isCustom && <span style={styles.customBadge}>Custom</span>}
            </div>
            <p style={styles.componentDesc}>{comp.description || 'No description'}</p>
            <div style={styles.cardFooter}>
              <span style={styles.propCount}>{Object.keys(comp.props || {}).length} props</span>
              {comp.category && <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{comp.category}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
