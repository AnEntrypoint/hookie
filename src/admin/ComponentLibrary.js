import React, { useState, useEffect } from 'react';
import componentRegistry from '../lib/componentRegistry';
import * as github from '../lib/github';
import { listComponentSchemas, loadComponentSchema, deleteComponentSchema } from '../lib/componentManager';
import { componentLoader } from '../lib/componentLoader';
import PropInput from './PropInput';

const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024
};

export default function ComponentLibrary({ owner, repo }) {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [previewProps, setPreviewProps] = useState({});
  const [pageUsage, setPageUsage] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [screenSize, setScreenSize] = useState(getScreenSize());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedMobileDetail, setExpandedMobileDetail] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
      if (getScreenSize() > BREAKPOINTS.tablet && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showMobileMenu]);

  useEffect(() => {
    loadComponents();
  }, [owner, repo]);

  useEffect(() => {
    if (selectedComponent) {
      setPreviewProps({});
    }
  }, [selectedComponent]);

  const loadComponents = async () => {
    try {
      setLoading(true);
      const allComponentNames = componentRegistry.getAllComponents();
      const customComponentNames = await listComponentSchemas(owner, repo);

      const componentList = allComponentNames.map(name => {
        const schema = componentRegistry.getComponent(name);
        const isCustom = customComponentNames.includes(name);
        return {
          name,
          ...schema,
          isCustom,
          isBuiltIn: !isCustom
        };
      });

      setComponents(componentList);

      const usage = {};
      const pages = await github.getRepoStructure(owner, repo);
      const pageFiles = (pages['content/pages'] || []).filter(f => f.name.endsWith('.json'));

      for (const pageFile of pageFiles) {
        const pageName = pageFile.name.replace('.json', '');
        const pageContent = await github.readFile(owner, repo, `content/pages/${pageFile.name}`);
        const pageData = JSON.parse(pageContent.content);

        const findComponents = (comps) => {
          const found = new Set();
          const traverse = (items) => {
            items.forEach(comp => {
              found.add(comp.type);
              if (comp.children) traverse(comp.children);
            });
          };
          traverse(comps || []);
          return found;
        };

        const usedComps = findComponents(pageData.components);
        usedComps.forEach(comp => {
          if (!usage[comp]) usage[comp] = [];
          usage[comp].push(pageName);
        });
      }

      setPageUsage(usage);
    } catch (error) {
      console.error('Error loading components:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComponent = async (componentName) => {
    try {
      await deleteComponentSchema(owner, repo, componentName, `Delete component: ${componentName}`);
      try {
        const fileInfo = await github.readFile(owner, repo, `src/components/${componentName}.js`);
        await github.deleteFile(owner, repo, `src/components/${componentName}.js`, `Delete component file: ${componentName}`, fileInfo.sha);
      } catch {
      }

      setComponents(prev => prev.filter(c => c.name !== componentName));
      setSelectedComponent(null);
      setPageUsage(prev => {
        const updated = { ...prev };
        delete updated[componentName];
        return updated;
      });
    } catch (error) {
      console.error('Error deleting component:', error);
    }
    setDeleteConfirm(null);
  };

  const isMobile = screenSize <= BREAKPOINTS.mobile;
  const isTablet = screenSize > BREAKPOINTS.mobile && screenSize <= BREAKPOINTS.tablet;
  const isDesktop = screenSize > BREAKPOINTS.tablet;

  const handlePropChange = (propName, propSchema) => (value) => {
    const coerceValue = (val, type) => {
      if (type === 'number') return isNaN(val) ? val : Number(val);
      if (type === 'boolean') return val === true || val === 'true';
      if (type === 'array' && typeof val === 'string') {
        try { return JSON.parse(val); } catch { return []; }
      }
      if (type === 'object' && typeof val === 'string') {
        try { return JSON.parse(val); } catch { return {}; }
      }
      return val;
    };

    setPreviewProps(prev => ({
      ...prev,
      [propName]: coerceValue(value, propSchema?.type)
    }));
  };

  const renderComponentPreview = () => {
    if (!selectedComponent) return null;

    const Component = componentLoader.getComponentImplementation(selectedComponent.name);
    if (!Component) {
      return <div style={styles.previewError}>Component implementation not found</div>;
    }

    try {
      return (
        <div style={styles.previewArea}>
          <div style={styles.previewContent}>
            <Component {...previewProps} />
          </div>
        </div>
      );
    } catch (error) {
      return <div style={styles.previewError}>Error rendering: {error.message}</div>;
    }
  };

  const filteredComponents = components.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || (filterType === 'custom' && comp.isCustom) || (filterType === 'builtin' && comp.isBuiltIn);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div style={styles.loading}>Loading components...</div>;
  }

  const renderMobileListItem = (comp) => (
    <div
      key={comp.name}
      onClick={() => {
        setSelectedComponent(comp);
        setExpandedMobileDetail(true);
        setShowMobileMenu(false);
      }}
      style={{
        ...styles.componentCard,
        ...(selectedComponent?.name === comp.name ? styles.componentCardActive : {})
      }}
    >
      <div style={styles.cardHeader}>
        <h3 style={styles.componentName}>{comp.name}</h3>
        {comp.isCustom && <span style={styles.customBadge}>Custom</span>}
      </div>
      <p style={styles.componentDesc}>{comp.description || 'No description'}</p>
      <div style={styles.cardFooter}>
        <span style={styles.propCount}>{Object.keys(comp.props || {}).length} props</span>
        {pageUsage[comp.name] && (
          <span style={styles.usageCount}>Used in {pageUsage[comp.name].length} page(s)</span>
        )}
      </div>
    </div>
  );

  const renderDetailPanel = () => {
    if (!selectedComponent) return null;

    return (
      <div style={getDetailPanelStyle()}>
        {isMobile && expandedMobileDetail && (
          <button
            onClick={() => setExpandedMobileDetail(false)}
            style={styles.backButton}
          >
            Back to List
          </button>
        )}

        <div style={styles.detailHeader}>
          <h2 style={styles.detailTitle}>{selectedComponent.name}</h2>
          {selectedComponent.isCustom && (
            <button
              onClick={() => setDeleteConfirm(selectedComponent.name)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          )}
        </div>

        {deleteConfirm === selectedComponent.name && (
          <div style={styles.confirmDialog}>
            <p>Are you sure? This cannot be undone.</p>
            <div style={styles.confirmActions}>
              <button
                onClick={() => handleDeleteComponent(selectedComponent.name)}
                style={styles.confirmDeleteBtn}
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={styles.confirmCancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={getDetailContentStyle()}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.sectionText}>{selectedComponent.description || 'No description provided'}</p>
          </div>

          {pageUsage[selectedComponent.name] && pageUsage[selectedComponent.name].length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Used in Pages</h3>
              <ul style={styles.usageList}>
                {pageUsage[selectedComponent.name].map(page => (
                  <li key={page} style={styles.usageItem}>{page}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedComponent.allowedChildren && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Allowed Children</h3>
              <p style={styles.sectionText}>
                {selectedComponent.allowedChildren.includes('*') ? 'Any component' : selectedComponent.allowedChildren.join(', ')}
              </p>
            </div>
          )}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Properties</h3>
            {Object.keys(selectedComponent.props || {}).length > 0 ? (
              <div style={getPropsGridStyle()}>
                {Object.entries(selectedComponent.props || {}).map(([propName, propSchema]) => (
                  <div key={propName} style={styles.propField}>
                    <label style={styles.propLabel}>
                      {propName}
                      <span style={styles.propType}>({propSchema?.type || 'unknown'})</span>
                    </label>
                    <PropInput
                      propName={propName}
                      propSchema={propSchema}
                      value={previewProps[propName] !== undefined ? previewProps[propName] : (propSchema?.default || '')}
                      onChange={handlePropChange(propName, propSchema)}
                    />
                    {propSchema?.default !== undefined && (
                      <span style={styles.defaultValue}>
                        Default: {JSON.stringify(propSchema.default)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.sectionText}>No props available</p>
            )}
          </div>

          <div style={getPreviewSectionStyle()}>
            <h3 style={styles.sectionTitle}>Live Preview</h3>
            {renderComponentPreview()}
          </div>
        </div>
      </div>
    );
  };

  const getHeaderStyle = () => {
    const base = {
      padding: isMobile ? '16px' : '24px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'relative',
    };
    return base;
  };

  const getFiltersStyle = () => {
    const base = {
      display: 'flex',
      gap: '12px',
      flexDirection: isMobile ? 'column' : 'row',
    };
    return base;
  };

  const getMainLayoutStyle = () => {
    if (isMobile) {
      return {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
      };
    }
    if (isTablet) {
      return {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
      };
    }
    return {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    };
  };

  const getListPanelStyle = () => {
    const base = {
      backgroundColor: '#ffffff',
      overflowY: 'auto',
    };

    if (isMobile) {
      if (expandedMobileDetail) {
        return { ...base, display: 'none' };
      }
      return { ...base, flex: 1, borderRight: 'none' };
    }

    if (isTablet) {
      return { ...base, flex: 1, borderRight: '1px solid #e2e8f0', minHeight: '300px' };
    }

    return { ...base, width: '320px', borderRight: '1px solid #e2e8f0' };
  };

  const getDetailPanelStyle = () => {
    const base = {
      backgroundColor: '#ffffff',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    };

    if (isMobile) {
      if (!expandedMobileDetail) {
        return { ...base, display: 'none' };
      }
      return { ...base, flex: 1, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 };
    }

    if (isTablet) {
      return { ...base, flex: 1 };
    }

    return { ...base, flex: 1 };
  };

  const getDetailContentStyle = () => {
    return {
      flex: 1,
      padding: isMobile ? '16px' : '24px',
      overflowY: 'auto',
    };
  };

  const getPropsGridStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
    };
  };

  const getPreviewSectionStyle = () => {
    return {
      padding: isMobile ? '16px' : '24px',
      borderTop: '1px solid #e2e8f0',
      maxHeight: isMobile ? '300px' : '400px',
    };
  };

  return (
    <div style={styles.container}>
      <div style={getHeaderStyle()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '12px' : '0' }}>
          <h2 style={{ ...styles.title, margin: 0, fontSize: isMobile ? '1.5rem' : '1.875rem' }}>Component Library</h2>
          {isMobile && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={styles.hamburgerButton}
              title="Toggle menu"
            >
              ☰
            </button>
          )}
        </div>
        <div style={getFiltersStyle()}>
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...styles.searchInput, flex: 1 }}
          />
          {!isMobile && (
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={styles.filterSelect}>
              <option value="all">All</option>
              <option value="builtin">Built-in</option>
              <option value="custom">Custom</option>
            </select>
          )}
        </div>
        {isMobile && (
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ ...styles.filterSelect, marginTop: '8px', width: '100%' }}
          >
            <option value="all">All Components</option>
            <option value="builtin">Built-in Only</option>
            <option value="custom">Custom Only</option>
          </select>
        )}
      </div>

      <div style={getMainLayoutStyle()}>
        <div style={getListPanelStyle()}>
          <div style={styles.componentsList}>
            {filteredComponents.map(renderMobileListItem)}
          </div>
        </div>

        {renderDetailPanel()}
      </div>
    </div>
  );
}

function getScreenSize() {
  return typeof window !== 'undefined' ? window.innerWidth : 1024;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#f8fafc',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#64748b',
    fontSize: '1rem',
  },
  header: {
    padding: '24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  filters: {
    display: 'flex',
    gap: '12px',
  },
  hamburgerButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#1e293b',
    padding: '4px 8px',
  },
  backButton: {
    padding: '12px 16px',
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '16px',
    marginBottom: '0',
  },
  searchInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  mainLayout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  listPanel: {
    width: '320px',
    borderRight: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    overflowY: 'auto',
  },
  componentsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  componentCard: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'background-color 150ms',
    userSelect: 'none',
  },
  componentCardActive: {
    backgroundColor: '#dbeafe',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    gap: '8px',
  },
  componentName: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  customBadge: {
    padding: '2px 8px',
    backgroundColor: '#fecaca',
    color: '#7f1d1d',
    fontSize: '0.7rem',
    borderRadius: '3px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  componentDesc: {
    margin: '0 0 12px 0',
    fontSize: '0.8rem',
    color: '#64748b',
    lineHeight: '1.4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#94a3b8',
    flexWrap: 'wrap',
    gap: '8px',
  },
  propCount: {
    fontWeight: '500',
  },
  usageCount: {
    fontWeight: '500',
    color: '#10b981',
  },
  detailPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    overflowY: 'auto',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
    gap: '12px',
    flexWrap: 'wrap',
  },
  detailTitle: {
    margin: 0,
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1e293b',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#fecaca',
    color: '#7f1d1d',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 150ms',
    whiteSpace: 'nowrap',
  },
  confirmDialog: {
    padding: '12px 24px',
    backgroundColor: '#fee2e2',
    borderBottom: '1px solid #fecaca',
    color: '#7f1d1d',
    fontSize: '0.875rem',
  },
  confirmActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  confirmDeleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  confirmCancelBtn: {
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  detailContent: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionText: {
    margin: 0,
    color: '#64748b',
    fontSize: '0.875rem',
    lineHeight: '1.6',
  },
  usageList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  usageItem: {
    padding: '8px 12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '4px',
    marginBottom: '6px',
    fontSize: '0.875rem',
    color: '#475569',
  },
  propsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  propField: {
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
  },
  propLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  propType: {
    marginLeft: '4px',
    color: '#64748b',
    fontWeight: '400',
    fontSize: '0.8rem',
  },
  defaultValue: {
    display: 'block',
    marginTop: '8px',
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  previewSection: {
    padding: '24px',
    borderTop: '1px solid #e2e8f0',
    maxHeight: '400px',
  },
  previewArea: {
    padding: '16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    minHeight: '200px',
    overflow: 'auto',
  },
  previewContent: {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
  },
  previewError: {
    padding: '16px',
    backgroundColor: '#fee2e2',
    color: '#7f1d1d',
    borderRadius: '4px',
    fontSize: '0.875rem',
  },
};
