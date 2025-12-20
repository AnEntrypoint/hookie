import React, { useState, useEffect } from 'react';
import Auth from './Auth.js';
import Builder from './Builder.js';
import ComponentCreator from './ComponentCreator.js';
import { contentManager } from '../lib/contentManager.js';
import { componentRegistry } from '../lib/componentRegistry.js';
import { liveReload } from '../lib/liveReload.js';

const AdminApp = () => {
  const [currentRoute, setCurrentRoute] = useState('');
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [changes, setChanges] = useState([]);
  const [repoInfo, setRepoInfo] = useState({ owner: '', repo: '' });
  const [syncStatus, setSyncStatus] = useState({
    lastSync: null,
    online: true,
    hasRemoteChanges: false
  });
  const [showNotification, setShowNotification] = useState(false);

  // Load repository info from environment
  useEffect(() => {
    const owner = import.meta.env?.VITE_GITHUB_OWNER || '';
    const repo = import.meta.env?.VITE_GITHUB_REPO || '';
    setRepoInfo({ owner, repo });
  }, []);

  // Hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentRoute(hash);

      // Parse route params
      if (hash.startsWith('#/admin/pages/')) {
        const pageName = hash.split('/')[3];
        loadPage(pageName);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Live reload watcher
  useEffect(() => {
    if (!repoInfo.owner || !repoInfo.repo) return;

    if (liveReload && liveReload.startWatching) {
      liveReload.startWatching(repoInfo.owner, repoInfo.repo, (newCommits) => {
        console.log('New commits detected:', newCommits);
        setSyncStatus(prev => ({ ...prev, hasRemoteChanges: true }));
        setShowNotification(true);
      });

      return () => {
        if (liveReload.stopWatching) {
          liveReload.stopWatching();
        }
      };
    }
  }, [repoInfo]);

  // Load page
  const loadPage = async (pageName) => {
    try {
      if (contentManager && contentManager.loadPage) {
        const pageData = await contentManager.loadPage(
          repoInfo.owner,
          repoInfo.repo,
          pageName
        );
        setCurrentPage({ name: pageName, data: pageData });
        localStorage.setItem('lastPage', pageName);
      } else {
        // Fallback: create mock page data
        setCurrentPage({
          name: pageName,
          data: {
            name: pageName,
            title: pageName,
            components: []
          }
        });
      }
    } catch (error) {
      console.error('Failed to load page:', error);
      // Create empty page on error
      setCurrentPage({
        name: pageName,
        data: {
          name: pageName,
          title: pageName,
          components: []
        }
      });
    }
  };

  // Helper: Get component by ID
  const getComponentById = (id) => {
    if (!currentPage || !currentPage.data) return null;

    const findInArray = (components) => {
      if (!components) return null;
      for (const comp of components) {
        if (comp.id === id) return comp;
        if (comp.children) {
          const found = findInArray(comp.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInArray(currentPage.data.components);
  };

  // Helper: Update component props
  const updateComponentProps = (pageData, componentId, newProps) => {
    const cloned = JSON.parse(JSON.stringify(pageData));

    const updateInArray = (components) => {
      if (!components) return;
      for (const comp of components) {
        if (comp.id === componentId) {
          comp.props = { ...comp.props, ...newProps };
          return;
        }
        if (comp.children) {
          updateInArray(comp.children);
        }
      }
    };

    updateInArray(cloned.components);
    return cloned;
  };

  // Helper: Update component style
  const updateComponentStyle = (pageData, componentId, newStyle) => {
    const cloned = JSON.parse(JSON.stringify(pageData));

    const updateInArray = (components) => {
      if (!components) return;
      for (const comp of components) {
        if (comp.id === componentId) {
          comp.style = { ...comp.style, ...newStyle };
          return;
        }
        if (comp.children) {
          updateInArray(comp.children);
        }
      }
    };

    updateInArray(cloned.components);
    return cloned;
  };

  // Helper: Get component schema
  const getComponentSchema = (componentId) => {
    const component = getComponentById(componentId);
    if (!component) return null;

    if (componentRegistry && componentRegistry.getSchema) {
      return componentRegistry.getSchema(component.type);
    }
    return null;
  };

  // Add change for tracking
  const addChange = (change) => {
    setChanges(prevChanges => {
      // Remove existing change for same path
      const filtered = prevChanges.filter(c => c.path !== change.path);
      return [...filtered, change];
    });
  };

  // Event handlers
  const handleSelectPage = (page) => {
    setCurrentPage(page);
    window.location.hash = `#/admin/pages/${page.name}`;
    localStorage.setItem('lastPage', page.name);
  };

  const handlePageUpdate = (updatedPageData) => {
    setCurrentPage({ ...currentPage, data: updatedPageData });

    // Track change
    addChange({
      path: `/content/pages/${currentPage.name}.json`,
      status: 'modified',
      content: JSON.stringify(updatedPageData, null, 2)
    });
  };

  const handlePropsChange = (updatedProps) => {
    const updatedPageData = updateComponentProps(
      currentPage.data,
      selectedComponentId,
      updatedProps
    );
    handlePageUpdate(updatedPageData);
  };

  const handleStyleChange = (updatedStyle) => {
    const updatedPageData = updateComponentStyle(
      currentPage.data,
      selectedComponentId,
      updatedStyle
    );
    handlePageUpdate(updatedPageData);
  };

  const handleComponentCreated = (componentName) => {
    // Reload component registry
    if (componentRegistry && componentRegistry.reload) {
      componentRegistry.reload();
    }

    // Show success message
    alert(`Component "${componentName}" created successfully!`);

    // Navigate back to pages
    window.location.hash = '#/admin';
  };

  const handleRefresh = async () => {
    // Reload current page from GitHub
    if (currentPage && contentManager && contentManager.loadPage) {
      try {
        const fresh = await contentManager.loadPage(
          repoInfo.owner,
          repoInfo.repo,
          currentPage.name
        );
        setCurrentPage({ ...currentPage, data: fresh });
      } catch (error) {
        console.error('Failed to refresh page:', error);
      }
    }

    setShowNotification(false);
    updateSyncStatus();
  };

  const updateSyncStatus = () => {
    setSyncStatus({
      lastSync: new Date(),
      online: navigator.onLine,
      hasRemoteChanges: false
    });
  };

  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleTimeString();
  };

  const loadCustomComponents = async () => {
    if (componentRegistry && componentRegistry.loadCustomComponents) {
      await componentRegistry.loadCustomComponents(repoInfo.owner, repoInfo.repo);
    }
  };

  // Render current view based on route
  const renderCurrentView = () => {
    const route = currentRoute;

    if (route === '#/admin' || route === '' || route === '#/') {
      // PageManager view - simplified for now
      return (
        <div className="page-manager">
          <h2>Pages</h2>
          <p>Page management interface would go here</p>
          <button onClick={() => handleSelectPage({ name: 'home', data: { name: 'home', title: 'Home', components: [] } })}>
            Open Home Page
          </button>
        </div>
      );
    }

    if (route.startsWith('#/admin/pages/')) {
      if (!currentPage) {
        return <div>Loading page...</div>;
      }

      return (
        <div className="builder-layout">
          <div className="builder-main">
            <Builder
              pageData={currentPage.data}
              onUpdate={handlePageUpdate}
            />
          </div>

          <div className="builder-sidebar">
            {selectedComponentId && (
              <>
                <div className="props-editor">
                  <h3>Props Editor</h3>
                  <p>Props editor for component {selectedComponentId}</p>
                </div>

                <div className="style-editor">
                  <h3>Style Editor</h3>
                  <p>Style editor for component {selectedComponentId}</p>
                </div>
              </>
            )}

            <div className="publish-manager">
              <h3>Publish</h3>
              <p>Changes: {changes.length}</p>
            </div>
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
        <div className="settings-view">
          <h2>Settings</h2>
          <div className="form-field">
            <label>Repository Owner</label>
            <p>{repoInfo.owner || 'Not set'}</p>
          </div>
          <div className="form-field">
            <label>Repository Name</label>
            <p>{repoInfo.repo || 'Not set'}</p>
          </div>
        </div>
      );
    }

    return <div>404 - Route not found</div>;
  };

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-logo">CMS Admin</h1>
          <nav className="admin-nav">
            <a href="#/admin">Pages</a>
            <a href="#/admin/components">Components</a>
            <a href="#/admin/settings">Settings</a>
          </nav>
        </div>

        <div className="admin-header-right">
          <div className="sync-status">
            {syncStatus.online ? (
              <>
                <span className="status-indicator online"></span>
                Last sync: {formatTime(syncStatus.lastSync)}
              </>
            ) : (
              <>
                <span className="status-indicator offline"></span>
                Offline
              </>
            )}
          </div>

          <Auth />
        </div>
      </header>

      {showNotification && (
        <div className="admin-notification">
          <span>New changes detected in repository</span>
          <button onClick={handleRefresh}>Refresh</button>
          <button onClick={() => setShowNotification(false)}>Dismiss</button>
        </div>
      )}

      <main className="admin-main">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default AdminApp;
