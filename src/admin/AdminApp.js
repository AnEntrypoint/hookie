import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { adminMachine } from '../machines/adminMachine';
import AdminHeader from './AdminHeader';
import PageManager from './PageManager';
import Builder from './Builder';
import ComponentCreator from './ComponentCreator';
import ComponentLibrary from './ComponentLibrary';
import Settings from './Settings';
import PublishModal from './PublishModal';
import LayoutEditor from './LayoutEditor';
import LayoutPreview from './LayoutPreview';
import { ToastContainer, useToast } from './Toast';
import { loadSettingsFromStorage, migrateStorageKeys, KEYS } from './settingsStorage';
import liveReload from '../lib/liveReload';
import contentManager from '../lib/contentManager';
import componentRegistry from '../lib/componentRegistry';
import { componentLoader } from '../lib/componentLoader';
import * as github from '../lib/github';
import { parseRoute, navigateTo } from './Router';
import './admin.css';

export default function AdminApp() {
  const [state, send] = useMachine(adminMachine);
  const { showToast } = useToast();
  const [lastAutosaved, setLastAutosaved] = React.useState(null);
  const ctx = state.context;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (state.context.changes.length > 0) send({ type: 'TOGGLE_PUBLISH_MODAL', show: true });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.context.changes]);

  useEffect(() => {
    migrateStorageKeys();
    const settings = loadSettingsFromStorage();
    const owner = settings.owner || import.meta.env.VITE_GITHUB_OWNER || '';
    const repo = settings.repo || import.meta.env.VITE_GITHUB_REPO || '';
    if (owner && !settings.owner) localStorage.setItem('github_owner', owner);
    if (repo && !settings.repo) localStorage.setItem('github_repo', repo);
    send({ type: 'INITIALIZED', repoInfo: { owner, repo } });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const route = parseRoute(window.location.hash);
      send({ type: 'ROUTE_CHANGED', route });
      send({ type: 'NAVIGATE', route: route.route });
      if (route.route === '/admin/pages/:pageName' && route.params.pageName && ctx.repoInfo.owner) {
        loadPage(route.params.pageName);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [ctx.repoInfo]);

  useEffect(() => {
    if (!ctx.repoInfo.owner || !ctx.repoInfo.repo) return;
    liveReload.startWatching(ctx.repoInfo.owner, ctx.repoInfo.repo, () => {
      send({ type: 'SYNC_REMOTE_CHANGES' });
    });
    return () => liveReload.stopWatching();
  }, [ctx.repoInfo]);

  useEffect(() => { if (ctx.repoInfo.owner && ctx.repoInfo.repo) loadCustomComponents(); }, [ctx.repoInfo]);
  useEffect(() => { if (ctx.repoInfo.owner && ctx.repoInfo.repo) loadLayoutData(); }, [ctx.repoInfo]);

  const loadLayoutData = async () => {
    try {
      const d = await github.readFile(ctx.repoInfo.owner, ctx.repoInfo.repo, 'content/layout.json');
      send({ type: 'SET_LAYOUT', layout: JSON.parse(d.content) });
    } catch (e) { console.warn('Layout load skipped:', e.message); }
  };

  const loadPage = async (pageName) => {
    send({ type: 'CLEAR_PAGE_ERROR' });
    try {
      const d = await contentManager.loadPage(ctx.repoInfo.owner, ctx.repoInfo.repo, pageName);
      send({ type: 'PAGE_LOADED', page: { name: pageName, data: d } });
      localStorage.setItem(KEYS.lastPage, pageName);
    } catch (e) {
      const m = e.message || '';
      let error;
      if (m.includes('401') || m.includes('403')) error = 'Unable to load page. Check your GitHub token in Settings.';
      else if (m.includes('404')) error = `Page "${pageName}" was not found in the repository.`;
      else error = `Could not load page "${pageName}". ${m}`;
      send({ type: 'PAGE_ERROR', error });
    }
  };

  const handlePageUpdate = (updatedPageData) => {
    send({
      type: 'PAGE_UPDATED',
      pageData: updatedPageData,
      change: { path: `content/pages/${ctx.currentPage.name}.json`, status: 'modified', content: JSON.stringify(updatedPageData, null, 2) },
    });
  };

  const handleSettingsUpdate = (info) => {
    send({ type: 'SET_REPO', repoInfo: info });
    showToast('GitHub connection configured. Welcome to Hookie!', 'success');
    navigateTo('/admin');
  };

  const handleRefresh = async () => {
    if (ctx.currentPage) {
      const d = await contentManager.loadPage(ctx.repoInfo.owner, ctx.repoInfo.repo, ctx.currentPage.name);
      send({ type: 'PAGE_LOADED', page: { name: ctx.currentPage.name, data: d } });
    }
    send({ type: 'REFRESH_COMPLETE' });
  };

  const loadCustomComponents = async () => {
    if (!ctx.repoInfo.owner || !ctx.repoInfo.repo) return;
    try {
      for (const [p, m] of Object.entries(import.meta.glob('../../content/components/*.json', { eager: true }))) {
        componentRegistry.registerComponent(p.split('/').pop().replace('.json', ''), m.default);
      }
      for (const [p, m] of Object.entries(import.meta.glob('../components/*.js', { eager: true }))) {
        const C = m.default;
        if (C && typeof C === 'function') componentLoader.registerComponentImplementation(p.split('/').pop().replace('.js', ''), C);
      }
    } catch (e) { console.warn('Error loading custom components:', e.message); }
  };

  const currentPageName = ctx.currentRoute.route === '/admin/pages/:pageName' ? ctx.currentRoute.params.pageName : null;

  const renderView = () => {
    const { route, params } = ctx.currentRoute;
    if (route === '/admin' || route === '') {
      return <PageManager owner={ctx.repoInfo.owner} repo={ctx.repoInfo.repo} onSelectPage={p => { send({ type: 'PAGE_LOADED', page: p }); navigateTo(`/admin/pages/${p.name}`); }} />;
    }
    if (route === '/admin/pages/:pageName') {
      if (ctx.pageError) {
        return (
          <div className="card bg-error/10 border border-error/30 mx-6 mt-6 p-8 text-center">
            <div className="text-3xl mb-3">⚠</div>
            <h2 className="text-lg font-bold text-error mb-2">Something went wrong</h2>
            <p className="text-content2 mb-4">{ctx.pageError}</p>
            <button onClick={() => { send({ type: 'CLEAR_PAGE_ERROR' }); loadPage(params.pageName); }} className="btn btn-primary btn-sm">Try Again</button>
          </div>
        );
      }
      if (!ctx.currentPage) return <div className="p-12 text-center text-content2">Loading page...</div>;
      return <Builder pageData={ctx.currentPage.data} onUpdate={handlePageUpdate} onAutosave={() => setLastAutosaved(Date.now())} layout={ctx.layoutData} />;
    }
    if (route === '/admin/components') {
      return <ComponentCreator owner={ctx.repoInfo.owner} repo={ctx.repoInfo.repo} onComponentCreated={n => {
        loadCustomComponents();
        showToast(`Component "${n}" created!`, 'success');
        navigateTo('/admin');
      }} />;
    }
    if (route === '/admin/library') return <ComponentLibrary owner={ctx.repoInfo.owner} repo={ctx.repoInfo.repo} />;
    if (route === '/admin/settings') return <Settings repoInfo={ctx.repoInfo} onUpdate={handleSettingsUpdate} />;
    if (route === '/admin/layout') {
      return (
        <div className="flex h-full">
          <div className="flex-1 min-w-0 border-r border-border1 overflow-y-auto">
            <LayoutEditor owner={ctx.repoInfo.owner} repo={ctx.repoInfo.repo} onSave={layout => send({ type: 'SET_LAYOUT', layout })} />
          </div>
          <div className="flex-1 min-w-0 overflow-y-auto hidden lg:block"><LayoutPreview layout={ctx.layoutData} /></div>
        </div>
      );
    }
    return <div className="p-12 text-center text-content2">Page not found</div>;
  };

  return (
    <div className="flex flex-col h-screen bg-backgroundSecondary">
      <AdminHeader
        currentRoute={ctx.currentRoute.route}
        currentPageName={currentPageName}
        syncStatus={ctx.syncStatus}
        showNotification={ctx.showNotification}
        onRefresh={handleRefresh}
        onDismissNotification={() => send({ type: 'DISMISS_NOTIFICATION' })}
        changesCount={ctx.changes.length}
        lastAutosaved={lastAutosaved}
        onPublish={() => send({ type: 'TOGGLE_PUBLISH_MODAL', show: true })}
      />

      {ctx.showWelcome && (
        <div className="alert alert-info text-center">Welcome to Hookie! Connect your GitHub repository to get started.</div>
      )}

      <main className="flex-1 overflow-y-auto overflow-x-hidden">{renderView()}</main>

      {ctx.showPublishModal && (
        <PublishModal
          changes={ctx.changes}
          owner={ctx.repoInfo.owner}
          repo={ctx.repoInfo.repo}
          onClose={() => send({ type: 'TOGGLE_PUBLISH_MODAL', show: false })}
          onPublishSuccess={() => send({ type: 'PUBLISH_SUCCESS' })}
        />
      )}

      <ToastContainer />
    </div>
  );
}
