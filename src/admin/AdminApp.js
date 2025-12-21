import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PageManager from './PageManager.js';
import Builder from './Builder.js';
import PropsEditor from './PropsEditor.js';
import StyleEditor from './StyleEditor.js';
import ComponentCreator from './ComponentCreator.js';
import PublishManager from './PublishManager.js';
import Auth from './Auth.js';
import { contentManager } from '../lib/contentManager.js';
import { liveReload } from '../lib/liveReload.js';
import { componentRegistry } from '../lib/componentRegistry.js';

const easeOut = 'cubic-bezier(0.4, 0, 0.2, 1)';

const colors = {
  primary: '#2563eb',
  primaryDark: '#1e40af',
  success: '#10b981',
  danger: '#ef4444',
  textDark: '#1e293b',
  textLight: '#64748b',
  textMuted: '#94a3b8',
  background: '#f8fafc',
  border: '#e2e8f0',
  white: '#ffffff',
};

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 40,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 28px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: colors.primary,
    margin: 0,
    letterSpacing: '-0.5px',
  },
  nav: {
    display: 'flex',
    gap: '24px',
  },
  navLink: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: colors.textLight,
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: `all 150ms ${easeOut}`,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
  },
  navLinkActive: {
    color: colors.primary,
    backgroundColor: '#f0f4ff',
  },
  navLinkHover: {
    color: colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  syncStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem',
    color: colors.textLight,
  },
  statusIndicator: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: colors.success,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  statusIndicatorOffline: {
    backgroundColor: colors.danger,
  },
  notification: {
    backgroundColor: '#fef3c7',
    border: `1px solid #fbbf24`,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  notificationText: {
    color: '#78350f',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  notificationActions: {
    display: 'flex',
    gap: '12px',
  },
  notificationButton: {
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: `all 150ms ${easeOut}`,
  },
  notificationRefresh: {
    backgroundColor: '#fbbf24',
    color: '#78350f',
  },
  notificationDismiss: {
    backgroundColor: 'transparent',
    color: '#78350f',
    border: `1px solid #fbbf24`,
  },
  main: {
    flex: 1,
    padding: '28px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  builderLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '24px',
    height: '100%',
  },
  builderMain: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  builderSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
    color: colors.textLight,
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: `3px solid ${colors.border}`,
    borderTop: `3px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  notFoundContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: colors.textLight,
    fontSize: '1.125rem',
  },
};

const formatTime = (date) => {
  if (!date) return 'Never';
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const isRouteActive = (currentRoute, path) => {
  if (path === '#/admin' || path === '') {
    return currentRoute === '#/admin' || currentRoute === '' || currentRoute === '#/';
  }
  return currentRoute.startsWith(path);
};

const AdminApp = () => {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/admin');
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [changes, setChanges] = useState([]);
  const [repoInfo, setRepoInfo] = useState({ owner: '', repo: '' });
  const [syncStatus, setSyncStatus] = useState({ lastSync: null, online: true, hasRemoteChanges: false });
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  useEffect(() => {
    const owner = import.meta.env.VITE_GITHUB_OWNER || localStorage.getItem('repo_owner') || '';
    const repo = import.meta.env.VITE_GITHUB_REPO || localStorage.getItem('repo_name') || '';
    setRepoInfo({ owner, repo });

    const lastPage = localStorage.getItem('lastPage');
    if (lastPage) {
      localStorage.setItem('currentRoute', `#/admin/pages/${lastPage}`);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/admin';
      setCurrentRoute(hash);
      setSelectedComponentId(null);

      if (!repoInfo.owner || !repoInfo.repo) return;

      if (hash.startsWith('#/admin/pages/')) {
        const pageName = decodeURIComponent(hash.split('/')[3]);
        loadPage(pageName);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [repoInfo]);

  useEffect(() => {
    if (!repoInfo.owner || !repoInfo.repo) return;

    liveReload.startWatching(repoInfo.owner, repoInfo.repo, (newCommits) => {
      setSyncStatus(prev => ({ ...prev, hasRemoteChanges: true }));
      setShowNotification(true);
    });

    return () => {
      liveReload.stopWatching();
    };
  }, [repoInfo]);

  const loadPage = useCallback(async (pageName) => {
    setLoading(true);
    try {
      const pageData = await contentManager.loadPage(repoInfo.owner, repoInfo.repo, pageName);
      setCurrentPage({ name: pageName, data: pageData });
      setChanges([]);
      localStorage.setItem('lastPage', pageName);
    } catch (error) {
      console.error('Failed to load page:', error);
      setCurrentPage(null);
    } finally {
      setLoading(false);
    }
  }, [repoInfo]);

  const handleSelectPage = useCallback((page) => {
    setCurrentPage(page);
    window.location.hash = `#/admin/pages/${encodeURIComponent(page.name)}`;
    localStorage.setItem('lastPage', page.name);
  }, []);

  const handlePageUpdate = useCallback((updatedPageData) => {
    setCurrentPage(prev => prev ? { ...prev, data: updatedPageData } : null);

    if (currentPage) {
      addChange({
        path: `/content/pages/${currentPage.name}.json`,
        status: 'modified',
        content: JSON.stringify(updatedPageData, null, 2)
      });
    }
  }, [currentPage]);

  const addChange = useCallback((change) => {
    setChanges(prevChanges => {
      const filtered = prevChanges.filter(c => c.path !== change.path);
      return [...filtered, change];
    });
  }, []);

  const getComponentById = useCallback((id) => {
    if (!currentPage || !currentPage.data) return null;

    const findInArray = (components) => {
      if (!Array.isArray(components)) return null;
      for (const comp of components) {
        if (comp.id === id) return comp;
        if (comp.children) {
          const found = findInArray(comp.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInArray(currentPage.data.components || []);
  }, [currentPage]);

  const updateComponentProps = useCallback((pageData, componentId, newProps) => {
    const cloned = JSON.parse(JSON.stringify(pageData));

    const updateInArray = (components) => {
      if (!Array.isArray(components)) return components;
      return components.map(comp => {
        if (comp.id === componentId) {
          return { ...comp, props: { ...comp.props, ...newProps } };
        }
        if (comp.children) {
          comp.children = updateInArray(comp.children);
        }
        return comp;
      });
    };

    cloned.components = updateInArray(cloned.components || []);
    return cloned;
  }, []);

  const updateComponentStyle = useCallback((pageData, componentId, newStyle) => {
    const cloned = JSON.parse(JSON.stringify(pageData));

    const updateInArray = (components) => {
      if (!Array.isArray(components)) return components;
      return components.map(comp => {
        if (comp.id === componentId) {
          return { ...comp, style: { ...comp.style, ...newStyle } };
        }
        if (comp.children) {
          comp.children = updateInArray(comp.children);
        }
        return comp;
      });
    };

    cloned.components = updateInArray(cloned.components || []);
    return cloned;
  }, []);

  const handlePropsChange = useCallback((updatedProps) => {
    if (!currentPage) return;
    const updatedPageData = updateComponentProps(currentPage.data, selectedComponentId, updatedProps);
    handlePageUpdate(updatedPageData);
  }, [currentPage, selectedComponentId, updateComponentProps, handlePageUpdate]);

  const handleStyleChange = useCallback((updatedStyle) => {
    if (!currentPage) return;
    const updatedPageData = updateComponentStyle(currentPage.data, selectedComponentId, updatedStyle);
    handlePageUpdate(updatedPageData);
  }, [currentPage, selectedComponentId, updateComponentStyle, handlePageUpdate]);

  const handleComponentCreated = useCallback(async (componentName) => {
    try {
      await loadCustomComponents();
      alert(`Component "${componentName}" created successfully!`);
      window.location.hash = '#/admin';
    } catch (error) {
      console.error('Failed to reload components:', error);
    }
  }, []);

  const loadCustomComponents = useCallback(async () => {
    if (!repoInfo.owner || !repoInfo.repo) return;
    try {
      const schemas = await contentManager.loadCustomComponentSchemas(repoInfo.owner, repoInfo.repo);
      if (schemas) {
        componentRegistry.registerCustomComponents(schemas);
      }
    } catch (error) {
      console.error('Failed to load custom components:', error);
    }
  }, [repoInfo]);

  const handleRefresh = useCallback(async () => {
    if (!currentPage) return;
    try {
      const fresh = await contentManager.loadPage(repoInfo.owner, repoInfo.repo, currentPage.name);
      setCurrentPage(prev => prev ? { ...prev, data: fresh } : null);
      setShowNotification(false);
      updateSyncStatus();
    } catch (error) {
      console.error('Failed to refresh page:', error);
    }
  }, [currentPage, repoInfo]);

  const updateSyncStatus = useCallback(async () => {
    setSyncStatus(prev => ({
      ...prev,
      lastSync: new Date(),
      hasRemoteChanges: false
    }));
  }, []);

  const renderCurrentView = useCallback(() => {
    const route = currentRoute;

    if (route === '#/admin' || route === '' || route === '#/') {
      return (
        <PageManager
          owner={repoInfo.owner}
          repo={repoInfo.repo}
          onSelectPage={handleSelectPage}
        />
      );
    }

    if (route.startsWith('#/admin/pages/')) {
      if (loading) {
        return (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <p>Loading page...</p>
          </div>
        );
      }

      if (!currentPage) {
        return (
          <div style={styles.loadingContainer}>
            <p>Page not found</p>
          </div>
        );
      }

      return (
        <div style={styles.builderLayout}>
          <div style={styles.builderMain}>
            <Builder
              pageData={currentPage.data}
              onUpdate={handlePageUpdate}
              onSelectComponent={setSelectedComponentId}
              selectedComponentId={selectedComponentId}
            />
          </div>

          <div style={styles.builderSidebar}>
            {selectedComponentId && (
              <>
                <PropsEditor
                  component={getComponentById(selectedComponentId)}
                  onChange={handlePropsChange}
                />

                <StyleEditor
                  style={getComponentById(selectedComponentId)?.style || {}}
                  onChange={handleStyleChange}
                />
              </>
            )}

            <PublishManager
              owner={repoInfo.owner}
              repo={repoInfo.repo}
              changes={changes}
            />
          </div>
        </div>
      );
    }

    if (route === '#/admin/components') {
      return (
        <ComponentCreator
          owner={repoInfo.owner}
          repo={repoInfo.repo}
          onComponentCreated={handleComponentCreated}
        />
      );
    }

    if (route === '#/admin/settings') {
      return (
        <div style={styles.main}>
          <h1 style={{ color: colors.textDark }}>Settings</h1>
          <p style={{ color: colors.textLight }}>Repository configuration and preferences</p>
        </div>
      );
    }

    return (
      <div style={styles.notFoundContainer}>
        <p>404 - Route not found</p>
      </div>
    );
  }, [currentRoute, loading, currentPage, selectedComponentId, repoInfo, changes, getComponentById, handleSelectPage, handlePageUpdate, handlePropsChange, handleStyleChange, handleComponentCreated]);

  return (
    <div style={styles.app}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>

      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h1 style={styles.logo}>CMS Admin</h1>
            <nav style={styles.nav}>
              <a
                href="#/admin"
                style={{
                  ...styles.navLink,
                  ...(isRouteActive(currentRoute, '#/admin') ? styles.navLinkActive : hoveredNav === 'pages' ? styles.navLinkHover : {})
                }}
                onMouseEnter={() => setHoveredNav('pages')}
                onMouseLeave={() => setHoveredNav(null)}
              >
                Pages
              </a>
              <a
                href="#/admin/components"
                style={{
                  ...styles.navLink,
                  ...(isRouteActive(currentRoute, '#/admin/components') ? styles.navLinkActive : hoveredNav === 'components' ? styles.navLinkHover : {})
                }}
                onMouseEnter={() => setHoveredNav('components')}
                onMouseLeave={() => setHoveredNav(null)}
              >
                Components
              </a>
              <a
                href="#/admin/settings"
                style={{
                  ...styles.navLink,
                  ...(isRouteActive(currentRoute, '#/admin/settings') ? styles.navLinkActive : hoveredNav === 'settings' ? styles.navLinkHover : {})
                }}
                onMouseEnter={() => setHoveredNav('settings')}
                onMouseLeave={() => setHoveredNav(null)}
              >
                Settings
              </a>
            </nav>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.syncStatus}>
              <span style={{
                ...styles.statusIndicator,
                ...(syncStatus.online ? {} : styles.statusIndicatorOffline)
              }} />
              {syncStatus.online ? (
                <>
                  <span>Last sync: {formatTime(syncStatus.lastSync)}</span>
                </>
              ) : (
                <span>Offline</span>
              )}
            </div>

            <Auth />
          </div>
        </div>
      </header>

      {showNotification && (
        <div style={styles.notification}>
          <span style={styles.notificationText}>
            New changes detected in repository
          </span>
          <div style={styles.notificationActions}>
            <button
              style={{...styles.notificationButton, ...styles.notificationRefresh}}
              onClick={handleRefresh}
            >
              Refresh
            </button>
            <button
              style={{...styles.notificationButton, ...styles.notificationDismiss}}
              onClick={() => setShowNotification(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main style={styles.main}>
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default AdminApp;
