import React, { useState, useEffect } from 'react';
import * as contentManager from '../lib/contentManager.js';

const PageManager = ({ owner, repo, onSelectPage }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [error, setError] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    loadPages();
  }, [owner, repo]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const pageList = await contentManager.listPages(owner, repo);
      setPages(pageList.sort());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (pageName) => {
    if (!pageName.trim()) {
      setError('Page name is required');
      return;
    }

    if (!/^[a-z0-9-_]+$/.test(pageName)) {
      setError('Page name can only contain lowercase letters, numbers, hyphens, and underscores');
      return;
    }

    setCreating(false);
    setNewPageName('');
    setLoading(true);

    try {
      const defaultPageData = {
        name: pageName,
        title: pageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        components: [
          {
            id: 'root-' + Date.now(),
            type: 'Container',
            props: { maxWidth: '1200px' },
            style: {},
            children: [
              {
                id: 'heading-' + Date.now(),
                type: 'Heading',
                props: { level: 1, text: 'Welcome to ' + pageName },
                style: {},
                children: []
              }
            ]
          }
        ]
      };

      await contentManager.savePage(owner, repo, pageName, defaultPageData, `Create page: ${pageName}`);

      const pageList = await contentManager.listPages(owner, repo);
      setPages(pageList.sort());

      onSelectPage({ name: pageName, data: defaultPageData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectPage = async (pageName) => {
    setLoading(true);
    try {
      const pageData = await contentManager.loadPage(owner, repo, pageName);
      if (pageData) {
        setSelectedPage(pageName);
        onSelectPage({ name: pageName, data: pageData });
      } else {
        setError('Page not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (pageName) => {
    if (!window.confirm(`Are you sure you want to delete "${pageName}"?`)) {
      return;
    }

    try {
      await contentManager.deletePage(owner, repo, pageName, `Delete page: ${pageName}`);

      const pageList = await contentManager.listPages(owner, repo);
      setPages(pageList.sort());
    } catch (err) {
      setError(err.message);
    }
  };

  const duplicatePage = async (pageName) => {
    const newName = window.prompt('Enter name for duplicated page:', `${pageName}-copy`);
    if (!newName) return;

    try {
      const pageData = await contentManager.loadPage(owner, repo, pageName);

      const duplicatedData = {
        ...pageData,
        name: newName,
        title: newName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      };

      await contentManager.savePage(owner, repo, newName, duplicatedData, `Duplicate page: ${pageName} -> ${newName}`);

      const pageList = await contentManager.listPages(owner, repo);
      setPages(pageList.sort());
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 28px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '32px 28px',
      borderBottom: '1px solid #e2e8f0',
      background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      marginBottom: '0',
      marginLeft: '-28px',
      marginRight: '-28px',
      marginTop: '-40px',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#1e293b',
      margin: 0,
      letterSpacing: '-0.5px',
      textShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    primaryButton: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '10px 16px',
      fontSize: '0.875rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: '150ms ease-in-out',
      fontWeight: 600
    },
    primaryButtonHover: {
      backgroundColor: '#1e40af',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
    },
    primaryButtonActive: {
      backgroundColor: '#1e3a8a'
    },
    secondaryButton: {
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      padding: '10px 16px',
      fontSize: '0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: '150ms ease-in-out',
      fontWeight: 500
    },
    secondaryButtonHover: {
      backgroundColor: '#e2e8f0',
      color: '#1e293b'
    },
    dangerButton: {
      backgroundColor: 'transparent',
      color: '#ef4444',
      padding: '10px 16px',
      fontSize: '0.875rem',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: '150ms ease-in-out',
      fontWeight: 500
    },
    dangerButtonHover: {
      backgroundColor: '#fee2e2'
    },
    ghostButton: {
      backgroundColor: 'transparent',
      color: '#64748b',
      padding: '10px 16px',
      fontSize: '0.875rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: '150ms ease-in-out',
      fontWeight: 500
    },
    ghostButtonHover: {
      backgroundColor: '#f1f5f9'
    },
    modalBackdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalCard: {
      backgroundColor: '#ffffff',
      padding: '32px',
      borderRadius: '12px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 15px 20px rgba(0,0,0,0.08)'
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#1e293b',
      margin: '0 0 20px 0'
    },
    input: {
      border: '1px solid #e2e8f0',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '1rem',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      transition: '150ms ease-in-out',
      marginBottom: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    inputFocus: {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.12)'
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end'
    },
    errorAlert: {
      background: 'linear-gradient(to right, #fee2e2, #fecaca)',
      border: '2px solid #ef4444',
      borderRadius: '12px',
      padding: '16px 20px',
      color: '#7f1d1d',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
      letterSpacing: '-0.2px',
      marginBottom: '24px'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      fontSize: '1.25rem',
      cursor: 'pointer',
      padding: '0',
      fontWeight: 700
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: '16px'
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      padding: '28px',
      minHeight: '400px',
      transition: 'gap 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      marginLeft: '-28px',
      marginRight: '-28px',
      marginBottom: '-40px',
      paddingBottom: '68px'
    },
    emptyState: {
      gridColumn: '1 / -1',
      backgroundColor: '#f8fafc',
      border: '2px dashed #cbd5e1',
      borderRadius: '8px',
      padding: '48px 28px',
      color: '#64748b',
      fontSize: '1rem',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px'
    },
    pageCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      transition: 'all 200ms ease-in-out'
    },
    pageCardHover: {
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-2px)'
    },
    cardPreview: {
      height: '120px',
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#1e293b',
      margin: 0
    },
    cardActions: {
      display: 'flex',
      gap: '8px'
    }
  };

  const buttonStateHandlers = (baseStyle, hoverStyle) => ({
    onMouseEnter: (e) => {
      Object.assign(e.target.style, hoverStyle);
    },
    onMouseLeave: (e) => {
      Object.assign(e.target.style, baseStyle);
    }
  });

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.header}>
        <h2 style={styles.title}>Pages</h2>
        <button
          style={styles.primaryButton}
          onClick={() => setCreating(true)}
          {...buttonStateHandlers(styles.primaryButton, styles.primaryButtonHover)}
        >
          + New Page
        </button>
      </div>

      {creating && (
        <div style={styles.modalBackdrop} onClick={() => setCreating(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Create New Page</h3>
            <input
              style={styles.input}
              type="text"
              placeholder="page-name"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value.toLowerCase())}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none' })}
              autoFocus
            />
            <div style={styles.modalActions}>
              <button
                style={styles.primaryButton}
                onClick={() => createPage(newPageName)}
                {...buttonStateHandlers(styles.primaryButton, styles.primaryButtonHover)}
              >
                Create
              </button>
              <button
                style={styles.ghostButton}
                onClick={() => setCreating(false)}
                {...buttonStateHandlers(styles.ghostButton, styles.ghostButtonHover)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={styles.errorAlert}>
          <span>{error}</span>
          <button
            style={styles.closeButton}
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={{ color: '#2563eb', fontWeight: 600 }}>Loading pages...</p>
        </div>
      ) : (
        <div style={styles.gridContainer}>
          {pages.length === 0 ? (
            <div style={styles.emptyState}>
              No pages yet. Create your first page!
            </div>
          ) : (
            pages.map(page => (
              <div
                key={page}
                style={styles.pageCard}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.pageCardHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.pageCard)}
              >
                <div style={styles.cardPreview}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardTitle}>{page}</h3>
                </div>
                <div style={styles.cardActions}>
                  <button
                    style={styles.primaryButton}
                    onClick={() => selectPage(page)}
                    {...buttonStateHandlers(styles.primaryButton, styles.primaryButtonHover)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.secondaryButton}
                    onClick={() => duplicatePage(page)}
                    {...buttonStateHandlers(styles.secondaryButton, styles.secondaryButtonHover)}
                  >
                    Duplicate
                  </button>
                  <button
                    style={styles.dangerButton}
                    onClick={() => deletePage(page)}
                    {...buttonStateHandlers(styles.dangerButton, styles.dangerButtonHover)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PageManager;
