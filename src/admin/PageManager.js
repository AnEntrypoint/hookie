import React, { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { pageManagerMachine } from '../machines/pageManagerMachine';
import contentManager from '../lib/contentManager';
import PageCard from './PageCard';
import CreatePageModal from './CreatePageModal';

export default function PageManager({ owner, repo, onSelectPage }) {
  const [state, send] = useMachine(pageManagerMachine);
  const [searchQuery, setSearchQuery] = useState('');
  const ctx = state.context;

  useEffect(() => { loadPages(); }, [owner, repo]);

  const loadPages = async () => {
    send({ type: 'RELOAD' });
    setSearchQuery('');
    if (!owner || !repo) { send({ type: 'NO_REPO' }); return; }
    try {
      const pageList = await contentManager.listPages(owner, repo);
      const sorted = Array.isArray(pageList) ? pageList.filter(p => p && p.name).sort((a, b) => a.name.localeCompare(b.name)) : [];
      send({ type: 'LOADED', pages: sorted });
    } catch (err) {
      const msg = err.message || '';
      let errorType = 'api';
      let error = msg || 'Failed to load pages';
      if (msg.includes('401') || msg.includes('403')) { errorType = 'auth'; error = 'Authentication failed. Check your GitHub token.'; }
      else if (msg.includes('404')) { errorType = 'not-found'; error = 'Repository or content path not found.'; }
      else if (msg.includes('Network') || msg.includes('fetch')) { errorType = 'network'; error = 'Network error. Check your connection.'; }
      send({ type: 'LOAD_ERROR', error, errorType });
    }
  };

  const handleCreatePage = async ({ slug, title, components }) => {
    send({ type: 'CREATE_START' });
    try {
      const pageData = { name: slug, title, components };
      await contentManager.savePage(owner, repo, slug, pageData);
      await loadPages();
      send({ type: 'CREATE_SUCCESS' });
      onSelectPage({ name: slug, data: pageData });
    } catch (err) { send({ type: 'CREATE_ERROR', error: err.message || 'Failed to create page' }); }
  };

  const handleEditPage = async (page) => {
    try {
      const pageData = await contentManager.loadPage(owner, repo, page.name);
      onSelectPage({ name: page.name, data: pageData });
    } catch (err) { send({ type: 'SET_ERROR', error: err.message || 'Failed to load page' }); }
  };

  const handleDuplicatePage = async (page, newName) => {
    try {
      const pageData = await contentManager.loadPage(owner, repo, page.name);
      const dup = { ...pageData, name: newName, title: formatTitle(newName) };
      await contentManager.savePage(owner, repo, newName, dup);
      await loadPages();
    } catch (err) { send({ type: 'SET_ERROR', error: err.message || 'Failed to duplicate' }); }
  };

  const handleDeletePage = async (page) => {
    try { await contentManager.deletePage(owner, repo, page.name); await loadPages(); }
    catch (err) { send({ type: 'SET_ERROR', error: err.message || 'Failed to delete' }); }
  };

  const formatTitle = (name) => name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const filteredPages = ctx.pages.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (state.matches('loading')) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-content2">
        <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
        <p>Loading pages...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-content1 shrink-0">Pages</h2>
        {ctx.pages.length > 0 && (
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search pages..."
            className="input input-bordered input-sm flex-1 max-w-xs"
          />
        )}
        {!state.matches('noRepo') && !state.matches('error') && (
          <button onClick={() => send({ type: 'SHOW_FORM' })} className="btn btn-primary btn-sm shrink-0">+ New Page</button>
        )}
      </header>

      {ctx.showForm && (
        <CreatePageModal existingPages={ctx.pages} onClose={() => send({ type: 'HIDE_FORM' })} onSubmit={handleCreatePage} submitting={ctx.submitting} />
      )}

      {ctx.error && (
        <div className="alert alert-error mb-4 flex justify-between items-center">
          {ctx.error}
          <button onClick={() => send({ type: 'CLEAR_ERROR' })} className="btn btn-ghost btn-xs">✕</button>
        </div>
      )}

      {state.matches('noRepo') ? (
        <EmptyState icon="*" heading="No repository configured" description="Connect a GitHub repository to start managing pages." action={<a href="#/admin/settings" className="btn btn-primary">Go to Settings</a>} />
      ) : state.matches('error') && !ctx.pages.length ? (
        <EmptyState icon="!" heading="Could not load pages" description={ctx.error} action={<button onClick={() => send({ type: 'RETRY' })} className="btn btn-primary">Retry</button>} />
      ) : ctx.pages.length === 0 ? (
        <EmptyState icon="+" heading="Create your first page" description="Pages are the building blocks of your site." suggestion={'Try creating a "home" or "about" page.'} action={<button onClick={() => send({ type: 'SHOW_FORM' })} className="btn btn-primary">Create Page</button>} />
      ) : filteredPages.length === 0 ? (
        <p className="text-sm text-content3 text-center py-8">No pages match "{searchQuery}"</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPages.map(page => <PageCard key={page.name} page={page} onEdit={handleEditPage} onDuplicate={handleDuplicatePage} onDelete={handleDeletePage} />)}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, heading, description, suggestion, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-border1 rounded-xl bg-backgroundSecondary min-h-[360px]">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-content1 mb-2">{heading}</h3>
      <p className="text-sm text-content2 max-w-sm leading-relaxed mb-2">{description}</p>
      {suggestion && <p className="text-xs text-content3 italic mb-5">{suggestion}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
