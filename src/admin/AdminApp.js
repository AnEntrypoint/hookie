import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import PageManager from './PageManager';
import Builder from './Builder';
import ComponentCreator from './ComponentCreator';
import ComponentLibrary from './ComponentLibrary';
import Settings from './Settings';
import PublishManager from './PublishManager';
import LayoutEditor from './LayoutEditor';
import LayoutPreview from './LayoutPreview';
import { loadSettingsFromStorage, migrateStorageKeys, KEYS } from './settingsStorage';
import { styles } from './adminAppStyles';
import liveReload from '../lib/liveReload';
import contentManager from '../lib/contentManager';
import componentRegistry from '../lib/componentRegistry';
import { componentLoader } from '../lib/componentLoader';
import * as github from '../lib/github';
import { parseRoute, navigateTo } from './Router';
import './admin.css';

export default function AdminApp() {
  const [currentRoute, setCurrentRoute] = useState(parseRoute(window.location.hash));
  const [currentPage, setCurrentPage] = useState(null);
  const [changes, setChanges] = useState([]);
  const [repoInfo, setRepoInfo] = useState({ owner: import.meta.env.VITE_GITHUB_OWNER || '', repo: import.meta.env.VITE_GITHUB_REPO || '' });
  const [syncStatus, setSyncStatus] = useState({ lastSync: null, online: true, hasRemoteChanges: false });
  const [showNotification, setShowNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [layoutData, setLayoutData] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    migrateStorageKeys();
    const settings = loadSettingsFromStorage();
    if (settings.owner && settings.repo) {
      setRepoInfo({ owner: settings.owner, repo: settings.repo });
    } else if (!import.meta.env.VITE_GITHUB_OWNER) {
      setShowWelcome(true);
      navigateTo('/admin/settings');
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
    liveReload.startWatching(repoInfo.owner, repoInfo.repo, () => {
      setSyncStatus(p => ({ ...p, hasRemoteChanges: true }));
      setShowNotification(true);
    });
    return () => liveReload.stopWatching();
  }, [repoInfo]);

  useEffect(() => { if (repoInfo.owner && repoInfo.repo) loadCustomComponents(); }, [repoInfo]);
  useEffect(() => { if (repoInfo.owner && repoInfo.repo) loadLayoutData(); }, [repoInfo]);

  const loadLayoutData = async () => {
    try {
      const d = await github.readFile(repoInfo.owner, repoInfo.repo, 'content/layout.json');
      setLayoutData(JSON.parse(d.content));
    } catch (e) {
      console.warn('Layout load skipped:', e.message);
    }
  };

  const loadPage = async (pageName) => {
    setPageError(null);
    try {
      const d = await contentManager.loadPage(repoInfo.owner, repoInfo.repo, pageName);
      setCurrentPage({ name: pageName, data: d });
      localStorage.setItem(KEYS.lastPage, pageName);
    } catch (e) {
      const m = e.message || '';
      if (m.includes('401') || m.includes('403')) setPageError('Unable to load page. Check your GitHub token in Settings.');
      else if (m.includes('404')) setPageError(`Page "${pageName}" was not found in the repository.`);
      else setPageError(`Could not load page "${pageName}". ${m}`);
    }
  };

  const handlePageUpdate = (updatedPageData) => {
    setCurrentPage(prev => ({ ...prev, data: updatedPageData }));
    addChange({ path: `content/pages/${currentPage.name}.json`, status: 'modified', content: JSON.stringify(updatedPageData, null, 2) });
  };

  const handleSettingsUpdate = (info) => {
    setRepoInfo(info);
    setShowWelcome(false);
    setSuccessMessage('GitHub connection configured. Welcome to Hookie!');
    setTimeout(() => setSuccessMessage(null), 5000);
    navigateTo('/admin');
  };

  const handleRefresh = async () => {
    if (currentPage) {
      const d = await contentManager.loadPage(repoInfo.owner, repoInfo.repo, currentPage.name);
      setCurrentPage({ name: currentPage.name, data: d });
    }
    setShowNotification(false);
    setSyncStatus(p => ({ ...p, lastSync: Date.now(), hasRemoteChanges: false }));
  };

  const loadCustomComponents = async () => {
    if (!repoInfo.owner || !repoInfo.repo) return;
    try {
      for (const [p, m] of Object.entries(import.meta.glob('../../content/components/*.json', { eager: true }))) {
        componentRegistry.registerComponent(p.split('/').pop().replace('.json', ''), m.default);
      }
      for (const [p, m] of Object.entries(import.meta.glob('../components/*.js', { eager: true }))) {
        const C = m.default;
        if (C && typeof C === 'function') componentLoader.registerComponentImplementation(p.split('/').pop().replace('.js', ''), C);
      }
    } catch (e) {
      console.warn('Error loading custom components:', e.message);
    }
  };

  const addChange = (change) => {
    setChanges(prev => [...prev.filter(c => c.path !== change.path), change]);
  };

  const handlePublishSuccess = () => {
    setChanges([]);
    setShowPublishModal(false);
  };

  const currentPageName = currentRoute.route === '/admin/pages/:pageName' ? currentRoute.params.pageName : null;

  const renderView = () => {
    const { route, params } = currentRoute;

    if (route === '/admin' || route === '') {
      return <PageManager owner={repoInfo.owner} repo={repoInfo.repo} onSelectPage={p => { setCurrentPage(p); navigateTo(`/admin/pages/${p.name}`); }} />;
    }

    if (route === '/admin/pages/:pageName') {
      if (pageError) {
        return (
          <div style={styles.errorPanel}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#991b1b' }}>Something went wrong</h2>
            <p style={{ margin: '0 0 16px', color: '#64748b' }}>{pageError}</p>
            <button onClick={() => { setPageError(null); loadPage(params.pageName); }} style={styles.retryButton}>Try Again</button>
          </div>
        );
      }
      if (!currentPage) return <div style={styles.loading}>Loading page...</div>;
      return (
        <Builder
          pageData={currentPage.data}
          onUpdate={handlePageUpdate}
        />
      );
    }

    if (route === '/admin/components') {
      return <ComponentCreator owner={repoInfo.owner} repo={repoInfo.repo} onComponentCreated={n => {
        loadCustomComponents();
        setSuccessMessage(`Component "${n}" created!`);
        setTimeout(() => setSuccessMessage(null), 3000);
        navigateTo('/admin');
      }} />;
    }

    if (route === '/admin/library') return <ComponentLibrary owner={repoInfo.owner} repo={repoInfo.repo} />;
    if (route === '/admin/settings') return <Settings repoInfo={repoInfo} onUpdate={handleSettingsUpdate} />;

    if (route === '/admin/layout') {
      return (
        <div style={styles.layoutContainer}>
          <div style={styles.layoutEditor}><LayoutEditor owner={repoInfo.owner} repo={repoInfo.repo} /></div>
          <div style={styles.layoutPreview}><LayoutPreview layout={layoutData} /></div>
        </div>
      );
    }

    return <div style={styles.notFound}>Page not found</div>;
  };

  return (
    <div style={styles.adminApp}>
      <AdminHeader
        currentRoute={currentRoute.route}
        currentPageName={currentPageName}
        syncStatus={syncStatus}
        showNotification={showNotification}
        onRefresh={handleRefresh}
        onDismissNotification={() => setShowNotification(false)}
        changesCount={changes.length}
        onPublish={() => setShowPublishModal(true)}
      />

      {showWelcome && (
        <div style={styles.welcomeBanner}>
          Welcome to Hookie! Connect your GitHub repository to get started.
        </div>
      )}

      {successMessage && (
        <div style={styles.successBanner}>
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} style={styles.dismissButton}>Dismiss</button>
        </div>
      )}

      <main style={styles.main}>{renderView()}</main>

      {showPublishModal && (
        <div style={modalStyles.overlay} onClick={e => e.target === e.currentTarget && setShowPublishModal(false)}>
          <div style={modalStyles.modal}>
            <div style={modalStyles.header}>
              <h2 style={modalStyles.title}>Publish Changes</h2>
              <button style={modalStyles.closeBtn} onClick={() => setShowPublishModal(false)}>✕</button>
            </div>
            <div style={modalStyles.body}>
              <PublishManager
                changes={changes}
                owner={repoInfo.owner}
                repo={repoInfo.repo}
                onRefresh={handlePublishSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '24px',
  },
  modal: {
    backgroundColor: '#ffffff', borderRadius: '16px',
    width: '100%', maxWidth: '700px', maxHeight: '90vh',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
  },
  title: { margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '1.25rem',
    cursor: 'pointer', color: '#64748b', padding: '4px 8px',
  },
  body: { flex: 1, overflowY: 'auto', padding: '0' },
};
