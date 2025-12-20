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

  useEffect(() => {
    const owner = import.meta.env?.VITE_GITHUB_OWNER || '';
    const repo = import.meta.env?.VITE_GITHUB_REPO || '';
    setRepoInfo({ owner, repo });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentRoute(hash);

      if (!repoInfo.owner || !repoInfo.repo) return;

      if (hash.startsWith('#/admin/pages/')) {
        const pageName = hash.split('/')[3];
        loadPage(pageName);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    if (repoInfo.owner && repoInfo.repo) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [repoInfo]);

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

  const getComponentSchema = (componentId) => {
    const component = getComponentById(componentId);
    if (!component) return null;

    if (componentRegistry && componentRegistry.getComponent) {
      return componentRegistry.getComponent(component.type);
    }
    return null;
  };

  const addChange = (change) => {
    setChanges(prevChanges => {
      const filtered = prevChanges.filter(c => c.path !== change.path);
      return [...filtered, change];
    });
  };

  const handleSelectPage = (page) => {
    setCurrentPage(page);
    window.location.hash = `#/admin/pages/${page.name}`;
    localStorage.setItem('lastPage', page.name);
  };

  const handlePageUpdate = (updatedPageData) => {
    setCurrentPage({ ...currentPage, data: updatedPageData });

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
    if (componentRegistry && componentRegistry.reload) {
      componentRegistry.reload();
    }

    alert(`Component "${componentName}" created successfully!`);
    window.location.hash = '#/admin';
  };

  const handleRefresh = async () => {
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

  const renderCurrentView = () => {
    const route = currentRoute;

    if (route === '#/admin' || route === '' || route === '#/') {
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
        <div className="settings-view" style={{ maxWidth: '600px' }}>
          <h2>Settings</h2>

          <div className="settings-section">
            <h3>Repository Configuration</h3>
            <div className="form-field">
              <label>Repository Owner</label>
              <p style={{ fontWeight: 'bold' }}>{repoInfo.owner || 'Not set'}</p>
            </div>
            <div className="form-field">
              <label>Repository Name</label>
              <p style={{ fontWeight: 'bold' }}>{repoInfo.repo || 'Not set'}</p>
            </div>
          </div>

          <div className="settings-section" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3>GitHub Authentication</h3>

            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fff9c4', borderRadius: '4px', fontSize: '13px' }}>
              <strong>Note:</strong> For 100% in-browser operation, use a Personal Access Token (easier) or OAuth with a backend proxy.
            </div>

            <h4 style={{ marginTop: '20px' }}>Option 1: Personal Access Token (Easiest)</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Create a PAT on GitHub for quick, browser-only authentication:
            </p>
            <ol style={{ fontSize: '14px', lineHeight: '1.8', color: '#333', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>github.com/settings/tokens</a></li>
              <li style={{ marginBottom: '10px' }}>Click "Generate new token" → "Generate new token (classic)"</li>
              <li style={{ marginBottom: '10px' }}>Select scopes: <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>repo</code> and <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px' }}>user</code></li>
              <li>Copy the token and paste below</li>
            </ol>

            <div className="form-field" style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>GitHub Personal Access Token</label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                defaultValue={localStorage.getItem('github_pat') || ''}
                onChange={(e) => localStorage.setItem('github_pat', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                Stored locally in browser. Never sent to any server.
              </p>
            </div>

            <h4 style={{ marginTop: '25px' }}>Option 2: GitHub OAuth Setup</h4>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
              To enable GitHub OAuth login, create an OAuth application at GitHub:
            </p>
            <ol style={{ fontSize: '14px', lineHeight: '1.8', color: '#333', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Go to <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>github.com/settings/developers</a></li>
              <li style={{ marginBottom: '10px' }}>Click "OAuth Apps" then "New OAuth App"</li>
              <li style={{ marginBottom: '10px' }}>Fill in Application name (e.g., "My CMS")</li>
              <li style={{ marginBottom: '10px' }}>Homepage URL: <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>http://localhost:5182</code></li>
              <li style={{ marginBottom: '10px' }}>Authorization callback URL: <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>http://localhost:5182/?auth=callback</code></li>
              <li style={{ marginBottom: '10px' }}>Click "Register application"</li>
              <li>Copy the "Client ID" from the next page and paste below</li>
            </ol>

            <div className="form-field" style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>GitHub OAuth Client ID</label>
              <input
                type="text"
                placeholder="Paste your Client ID here"
                defaultValue={localStorage.getItem('github_client_id') || ''}
                onChange={(e) => localStorage.setItem('github_client_id', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                Saved automatically in localStorage
              </p>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#e7f3ff',
              color: '#004085',
              borderRadius: '4px',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              <strong>After setup:</strong> Click "Sign in with GitHub" button to login with your GitHub account. You'll be redirected to GitHub to authorize the app.
            </div>
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
