import React, { useState, useMemo } from 'react';
import componentRegistry from '../lib/componentRegistry';
import PaletteComponentCard, { getCategoryLabel } from './PaletteComponentCard';
import PaletteTreeNode from './PaletteTreeNode';
import { styles } from './componentPaletteStyles';

const CATEGORY_ORDER = ['Layout', 'Content', 'Interactive', 'Display', 'Custom'];

function useResponsive() {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    return window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
  });

  React.useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setScreenSize(w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

export default function ComponentPalette({ pageData, selectedId, onSelect, onDelete, onDuplicate, isVisible, onToggleVisibility }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dragLongPressed, setDragLongPressed] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const screenSize = useResponsive();
  const allComponents = componentRegistry.getAllComponents();
  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';

  const filteredComponents = useMemo(() => {
    return allComponents.filter(name => {
      const schema = componentRegistry.getComponent(name);
      const description = schema?.description || '';
      const searchLower = searchTerm.toLowerCase();
      return name.toLowerCase().includes(searchLower) || description.toLowerCase().includes(searchLower);
    });
  }, [allComponents, searchTerm]);

  const categorized = useMemo(() => {
    const groups = {};
    filteredComponents.forEach(name => {
      const cat = getCategoryLabel(name);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(name);
    });
    return CATEGORY_ORDER
      .filter(cat => groups[cat]?.length)
      .map(cat => ({ name: cat, items: groups[cat] }))
      .concat(
        Object.keys(groups)
          .filter(cat => !CATEGORY_ORDER.includes(cat))
          .map(cat => ({ name: cat, items: groups[cat] }))
      );
  }, [filteredComponents]);

  const toggleCategory = (name) => {
    setCollapsedCategories(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const containerStyle = isMobile
    ? { ...styles.container, ...styles.containerMobile, display: isVisible ? 'flex' : 'none' }
    : isTablet ? { ...styles.container, ...styles.containerTablet } : styles.container;

  const itemsStyle = isMobile ? styles.categoryItemsMobile : isTablet ? styles.categoryItemsTablet : styles.categoryItems;

  return (
    <>
      {isMobile && (
        <>
          <button onClick={() => onToggleVisibility(!isVisible)} style={styles.paletteToggle} title="Toggle components palette">+</button>
          {isVisible && <div style={styles.mobileOverlay} onClick={() => onToggleVisibility(false)} />}
        </>
      )}

      <div style={containerStyle}>
        <div style={isMobile ? styles.mobileHeader : {}}>
          {isMobile && <button onClick={() => onToggleVisibility(false)} style={styles.closeButton} title="Close palette">x</button>}
          <h3 style={styles.heading}>Components</h3>
        </div>

        <div style={styles.section}>
          <div style={styles.searchContainer}>
            <input type="text" placeholder={isMobile ? 'Search...' : 'Search components...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />
            {searchTerm && <button onClick={() => setSearchTerm('')} style={styles.clearSearchButton} title="Clear search">x</button>}
          </div>
          {!isMobile && <div style={styles.resultCounter}>Showing {filteredComponents.length} of {allComponents.length}</div>}

          {allComponents.length === 0 ? (
            <div style={styles.emptyStateContainer}>
              <div style={styles.emptyIcon}>+</div>
              <h3 style={styles.emptyTitle}>No components yet</h3>
              <p style={styles.emptyDescription}>Create components to extend your design system.</p>
            </div>
          ) : filteredComponents.length === 0 ? (
            <div style={styles.noResults}>No components found</div>
          ) : searchTerm || isMobile ? (
            <div style={isMobile ? styles.paletteMobile : isTablet ? styles.paletteTablet : styles.palette}>
              {filteredComponents.map(type => (
                <PaletteComponentCard key={type} type={type} isMobile={isMobile} isTablet={isTablet} dragLongPressed={dragLongPressed} setDragLongPressed={setDragLongPressed} />
              ))}
            </div>
          ) : (
            <div>
              {categorized.map(cat => (
                <div key={cat.name}>
                  <div style={styles.categoryHeader} onClick={() => toggleCategory(cat.name)}>
                    <span style={styles.categoryLabel}>{cat.name}</span>
                    <span style={styles.categoryCount}>{cat.items.length} {collapsedCategories[cat.name] ? '>' : 'v'}</span>
                  </div>
                  {!collapsedCategories[cat.name] && (
                    <div style={itemsStyle}>
                      {cat.items.map(type => (
                        <PaletteComponentCard key={type} type={type} isMobile={isMobile} isTablet={isTablet} dragLongPressed={dragLongPressed} setDragLongPressed={setDragLongPressed} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!isMobile && (
          <div style={styles.section}>
            <h3 style={styles.heading}>Page Structure</h3>
            <div style={styles.tree}>
              {pageData && pageData.components && pageData.components.map(component => (
                <PaletteTreeNode key={component.id} component={component} selectedId={selectedId} onSelect={onSelect} onDelete={onDelete} onDuplicate={onDuplicate} setDeleteConfirm={setDeleteConfirm} />
              ))}
            </div>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div style={styles.modalBackdrop}>
          <div style={styles.confirmModal}>
            <div style={styles.confirmContent}>
              <h3 style={styles.confirmTitle}>Remove component</h3>
              <p style={styles.confirmMessage}>Remove '{deleteConfirm.componentName}' from page? This cannot be undone.</p>
            </div>
            <div style={styles.confirmActions}>
              <button onClick={() => setDeleteConfirm(null)} style={styles.cancelButton}>Cancel</button>
              <button onClick={() => { onDelete(deleteConfirm.componentId); setDeleteConfirm(null); }} style={styles.destructiveButton}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
