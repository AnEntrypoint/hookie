import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import PageManager from './PageManager';
import Builder from './Builder';
import ComponentCreator from './ComponentCreator';
import ComponentLibrary from './ComponentLibrary';
import Settings from './Settings';
import PropsEditor from './PropsEditor';
import StyleEditor from './StyleEditor';
import PublishManager from './PublishManager';
import ComponentReuseTestPage from './ComponentReuseTestPage';
import liveReload from '../lib/liveReload';
import contentManager from '../lib/contentManager';
import componentRegistry from '../lib/componentRegistry';
import { componentLoader } from '../lib/componentLoader';
import * as github from '../lib/github';
import { parseRoute, navigateTo } from './Router';
import { breakpoints, minTouchSize } from './responsiveStyles';

export default function AdminApp() {
  const [currentRoute, setCurrentRoute] = useState(parseRoute(window.location.hash));
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [changes, setChanges] = useState([]);
  const [repoInfo, setRepoInfo] = useState({
    owner: import.meta.env.VITE_GITHUB_OWNER || '',
    repo: import.meta.env.VITE_GITHUB_REPO || '',
  });
  const [syncStatus, setSyncStatus] = useState({ lastSync: null, online: true, hasRemoteChanges: false });
  const [showNotification, setShowNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const owner = localStorage.getItem('repo_owner');
    const repo = localStorage.getItem('repo_name');
    if (owner && repo) {
      setRepoInfo({ owner, repo });
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const route = parseRoute(window.location.hash);
      setCurrentRoute(route);

      if (route.route === '/admin/pages/:pageName' && route.params.pageName && repoInfo.owner && repoInfo.repo) {
        loadPage(route.params.pageName);
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

    return () => liveReload.stopWatching();
  }, [repoInfo]);

  useEffect(() => {
    if (!repoInfo.owner || !repoInfo.repo) return;
    loadCustomComponents();
  }, [repoInfo]);

  const loadPage = async (pageName) => {
    try {
      const pageData = await contentManager.loadPage(repoInfo.owner, repoInfo.repo, pageName);
      setCurrentPage({ name: pageName, data: pageData });
      localStorage.setItem('lastPage', pageName);
    } catch (error) {
    }
  };

  const handleSelectPage = (page) => {
    setCurrentPage(page);
    navigateTo(`/admin/pages/${page.name}`);
  };

  const handlePageUpdate = (updatedPageData) => {
    setCurrentPage(prev => ({ ...prev, data: updatedPageData }));
    addChange({
      path: `/content/pages/${currentPage.name}.json`,
      status: 'modified',
      content: JSON.stringify(updatedPageData, null, 2),
    });
  };

  const handleComponentCreated = (componentName) => {
    loadCustomComponents();
    setSuccessMessage(`Component "${componentName}" created successfully!`);
    setTimeout(() => setSuccessMessage(null), 3000);
    navigateTo('/admin');
  };

  const handleRefresh = async () => {
    if (currentPage) {
      const pageData = await contentManager.loadPage(repoInfo.owner, repoInfo.repo, currentPage.name);
      setCurrentPage({ name: currentPage.name, data: pageData });
    }
    setShowNotification(false);
    updateSyncStatus();
  };

  const loadCustomComponents = async () => {
    if (!repoInfo.owner || !repoInfo.repo) return;
    try {
      const componentNames = await contentManager.listComponentSchemas(repoInfo.owner, repoInfo.repo);
      for (const name of componentNames) {
        const schema = await contentManager.loadComponentSchema(repoInfo.owner, repoInfo.repo, name);
        componentRegistry.registerComponent(name, schema);

        try {
          const codeContent = await github.readFile(repoInfo.owner, repoInfo.repo, `src/components/${name}.js`);
          let code = codeContent.content;

          const transformedCode = code.replace(/export\s+default\s+/, 'module.exports.default = ');

          const mod = { exports: {} };
          new Function('React', 'module', 'exports', transformedCode)(window.React, mod, mod.exports);
          const Component = mod.exports.default;
          if (Component && typeof Component === 'function') {
            componentLoader.registerComponentImplementation(name, Component);
          } else if (!Component) {
            console.warn(`Component ${name} has no default export`);
          }
        } catch (err) {
          console.warn(`Failed to load implementation for ${name}:`, err.message);
        }
      }
    } catch (error) {
      console.warn('Error loading custom components:', error.message);
    }
  };

  const updateSyncStatus = () => {
    setSyncStatus(prev => ({ ...prev, lastSync: Date.now(), hasRemoteChanges: false }));
  };

  const addChange = (change) => {
    setChanges(prev => {
      const filtered = prev.filter(c => c.path !== change.path);
      return [...filtered, change];
    });
  };

  const updateComponentById = (pageData, componentId, updates) => {
    const updateRecursive = (components) => {
      return components.map(comp => {
        if (comp.id === componentId) {
          return {
            ...comp,
            props: updates.props !== undefined ? { ...comp.props, ...updates.props } : comp.props,
            style: updates.style !== undefined ? { ...comp.style, ...updates.style } : comp.style,
          };
        }
        if (comp.children && comp.children.length > 0) {
          return { ...comp, children: updateRecursive(comp.children) };
        }
        return comp;
      });
    };
    return { ...pageData, components: updateRecursive(pageData.components || []) };
  };

  const renderCurrentView = () => {
    const { route, params } = currentRoute;

    if (route === '/admin' || route === '') {
      return (
        <PageManager
          owner={repoInfo.owner}
          repo={repoInfo.repo}
          onSelectPage={handleSelectPage}
        />
      );
    }

    if (route === '/admin/pages/:pageName') {
      if (!currentPage) {
        return <div style={styles.loading}>Loading page...</div>;
      }

      return (
        <div style={styles.builderLayout}>
          <div style={styles.builderMain}>
            <Builder pageData={currentPage.data} onUpdate={handlePageUpdate} />
          </div>
          <div style={styles.builderSidebar}>
            {selectedComponentId && (
              <>
                <PropsEditor
                  componentId={selectedComponentId}
                  pageData={currentPage.data}
                  onChange={(newProps) => {
                    const updatedData = updateComponentById(currentPage.data, selectedComponentId, { props: newProps });
                    handlePageUpdate(updatedData);
                  }}
                />
                <StyleEditor
                  componentId={selectedComponentId}
                  pageData={currentPage.data}
                  onChange={(newStyle) => {
                    const updatedData = updateComponentById(currentPage.data, selectedComponentId, { style: newStyle });
                    handlePageUpdate(updatedData);
                  }}
                />
              </>
            )}
            <PublishManager changes={changes} owner={repoInfo.owner} repo={repoInfo.repo} />
          </div>
        </div>
      );
    }

    if (route === '/admin/components') {
      return (
        <ComponentCreator
          owner={repoInfo.owner}
          repo={repoInfo.repo}
          onComponentCreated={handleComponentCreated}
        />
      );
    }

    if (route === '/admin/library') {
      return (
        <ComponentLibrary
          owner={repoInfo.owner}
          repo={repoInfo.repo}
        />
      );
    }

    if (route === '/admin/settings') {
      return <Settings repoInfo={repoInfo} onUpdate={setRepoInfo} />;
    }

    if (route === '/admin/component-reuse-test') {
      return <ComponentReuseTestPage />;
    }

    return <div style={styles.notFound}>404 - Page not found</div>;
  };

  return (
    <div style={styles.adminApp}>
      <AdminHeader
        currentRoute={currentRoute.route}
        syncStatus={syncStatus}
        showNotification={showNotification}
        onRefresh={handleRefresh}
        onDismissNotification={() => setShowNotification(false)}
      />
      {successMessage && (
        <div style={styles.successBanner}>
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} style={styles.dismissButton}>Dismiss</button>
        </div>
      )}
      <main style={styles.main}>{renderCurrentView()}</main>
    </div>
  );
}

const styles = {
  adminApp: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f8fafc',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  builderLayout: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      flexDirection: 'column',
    },
  },
  builderMain: {
    flex: 1,
    minHeight: 0,
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      order: 1,
      minHeight: '400px',
    },
  },
  builderSidebar: {
    width: '320px',
    borderLeft: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    padding: '16px',
    overflowY: 'auto',
    overflowX: 'hidden',
    [`@media (max-width: ${breakpoints.laptop}px)`]: {
      width: '280px',
      padding: '12px',
    },
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      width: '100%',
      order: 2,
      borderLeft: 'none',
      borderTop: '1px solid #e2e8f0',
      maxHeight: '300px',
      padding: '12px',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      maxHeight: '250px',
      padding: '8px',
    },
  },
  loading: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '1rem',
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      padding: '32px 16px',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      padding: '24px 12px',
    },
  },
  notFound: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '1rem',
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      padding: '32px 16px',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      padding: '24px 12px',
    },
  },
  successBanner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    borderBottom: '1px solid #10b981',
    gap: '12px',
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      padding: '10px 16px',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      padding: '8px 12px',
      fontSize: '0.875rem',
    },
  },
  dismissButton: {
    background: 'none',
    border: 'none',
    color: '#065f46',
    cursor: 'pointer',
    fontWeight: '500',
    ...minTouchSize,
    fontSize: '1rem',
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      fontSize: '0.875rem',
      padding: '6px 12px',
    },
  },
};
