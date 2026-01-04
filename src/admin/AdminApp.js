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
import LayoutEditor from './LayoutEditor';
import LayoutPreview from './LayoutPreview';
import liveReload from '../lib/liveReload';
import contentManager from '../lib/contentManager';
import componentRegistry from '../lib/componentRegistry';
import { componentLoader } from '../lib/componentLoader';
import * as github from '../lib/github';
import { parseRoute, navigateTo } from './Router';
import { minTouchSize } from './responsiveStyles';
import './admin.css';

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
  const [layoutData, setLayoutData] = useState(null);

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

  useEffect(() => {
    if (!repoInfo.owner || !repoInfo.repo) return;
    loadLayoutData();
  }, [repoInfo]);

  const loadLayoutData = async () => {
    try {
      const data = await github.readFile(repoInfo.owner, repoInfo.repo, 'content/layout.json');
      const parsed = JSON.parse(data.content);
      setLayoutData(parsed);
    } catch (error) {
    }
  };

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
      const schemaModules = import.meta.glob('../../content/components/*.json', { eager: true });

      for (const [path, module] of Object.entries(schemaModules)) {
        const schema = module.default;
        const componentName = path.split('/').pop().replace('.json', '');
        componentRegistry.registerComponent(componentName, schema);
      }

      const componentModules = import.meta.glob('../components/*.js', { eager: true });

      for (const [path, module] of Object.entries(componentModules)) {
        const componentName = path.split('/').pop().replace('.js', '');
        const Component = module.default;

        if (Component && typeof Component === 'function') {
          componentLoader.registerComponentImplementation(componentName, Component);
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
        return <div style={styles.loading} className="admin-loading">Loading page...</div>;
      }

      return (
        <div style={styles.builderLayout} className="admin-builder-layout">
          <div style={styles.builderMain} className="admin-builder-main">
            <Builder pageData={currentPage.data} onUpdate={handlePageUpdate} />
          </div>
          <div style={styles.builderSidebar} className="admin-builder-sidebar">
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

    if (route === '/admin/layout') {
      return (
        <div style={styles.layoutContainer}>
          <div style={styles.layoutEditor}>
            <LayoutEditor
              owner={repoInfo.owner}
              repo={repoInfo.repo}
            />
          </div>
          <div style={styles.layoutPreview}>
            <LayoutPreview layout={layoutData} />
          </div>
        </div>
      );
    }

    return <div style={styles.notFound} className="admin-not-found">404 - Page not found</div>;
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
        <div style={styles.successBanner} className="admin-success-banner">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} style={styles.dismissButton} className="admin-dismiss-button">Dismiss</button>
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
  },
  builderMain: {
    flex: 1,
    minHeight: 0,
  },
  builderSidebar: {
    width: '320px',
    borderLeft: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    padding: '16px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  layoutContainer: {
    display: 'flex',
    height: '100%',
    gap: 0,
  },
  layoutEditor: {
    flex: 1,
    minWidth: 0,
    borderRight: '1px solid #e2e8f0',
    overflowY: 'auto',
  },
  layoutPreview: {
    flex: 1,
    minWidth: 0,
    overflowY: 'auto',
    display: 'none',
  },
  loading: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '1rem',
  },
  notFound: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '1rem',
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
  },
  dismissButton: {
    background: 'none',
    border: 'none',
    color: '#065f46',
    cursor: 'pointer',
    fontWeight: '500',
    ...minTouchSize,
    fontSize: '1rem',
  },
};

if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
  styles.layoutPreview.display = 'block';
}
