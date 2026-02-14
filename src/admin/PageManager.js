import React, { useState, useEffect } from 'react';
import contentManager from '../lib/contentManager';
import PageCard from './PageCard';
import CreatePageModal from './CreatePageModal';
import { styles } from './pageManagerStyles';

export default function PageManager({ owner, repo, onSelectPage }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);

  useEffect(() => {
    loadPages();
  }, [owner, repo]);

  const loadPages = async () => {
    setLoading(true);
    setError(null);
    setErrorType(null);
    if (!owner || !repo) {
      setLoading(false);
      setErrorType('no-repo');
      return;
    }
    try {
      const pageList = await contentManager.listPages(owner, repo);
      const sortedPages = Array.isArray(pageList)
        ? pageList.filter(p => p && p.name).sort((a, b) => a.name.localeCompare(b.name))
        : [];
      setPages(sortedPages);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('401') || msg.includes('403')) {
        setErrorType('auth');
        setError('Authentication failed. Check your GitHub token in Settings.');
      } else if (msg.includes('404')) {
        setErrorType('not-found');
        setError('Repository or content path not found. Check your repository settings.');
      } else if (msg.includes('Network') || msg.includes('fetch')) {
        setErrorType('network');
        setError('Network error. Check your internet connection.');
      } else {
        setErrorType('api');
        setError(msg || 'Failed to load pages');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async ({ slug, title, components }) => {
    setSubmitting(true);
    setError(null);
    try {
      const pageData = { name: slug, title, components };
      await contentManager.savePage(owner, repo, slug, pageData);
      await loadPages();
      setShowForm(false);
      setSubmitting(false);
      onSelectPage({ name: slug, data: pageData });
    } catch (err) {
      setError(err.message || 'Failed to create page');
      setSubmitting(false);
    }
  };

  const handleEditPage = async (page) => {
    try {
      const pageData = await contentManager.loadPage(owner, repo, page.name);
      onSelectPage({ name: page.name, data: pageData });
    } catch (err) {
      setError(err.message || 'Failed to load page');
    }
  };

  const handleDuplicatePage = async (page, newName) => {
    try {
      const pageData = await contentManager.loadPage(owner, repo, page.name);
      const duplicatedData = { ...pageData, name: newName, title: formatPageTitle(newName) };
      await contentManager.savePage(owner, repo, newName, duplicatedData);
      await loadPages();
    } catch (err) {
      setError(err.message || 'Failed to duplicate page');
    }
  };

  const handleDeletePage = async (page) => {
    try {
      await contentManager.deletePage(owner, repo, page.name);
      await loadPages();
    } catch (err) {
      setError(err.message || 'Failed to delete page');
    }
  };

  const formatPageTitle = (name) => name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading pages...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.heading}>Pages</h2>
        {!errorType && (
          <button onClick={() => setShowForm(true)} style={styles.newButton}>+ New Page</button>
        )}
      </header>

      {showForm && (
        <CreatePageModal
          existingPages={pages}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreatePage}
          submitting={submitting}
        />
      )}

      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={() => setError(null)} style={styles.dismissButton}>x</button>
        </div>
      )}

      {errorType === 'no-repo' ? (
        <EmptyState
          icon="*"
          heading="No repository configured"
          description="Connect a GitHub repository to start managing pages."
          action={<a href="#/admin/settings" style={emptyActionStyle}>Go to Settings</a>}
        />
      ) : errorType && !pages.length ? (
        <EmptyState
          icon="!"
          heading="Could not load pages"
          description={error}
          action={<button onClick={loadPages} style={emptyActionStyle}>Retry</button>}
        />
      ) : pages.length === 0 ? (
        <EmptyState
          icon="+"
          heading="Create your first page"
          description="Pages are the building blocks of your site. Each page is a collection of components arranged on a canvas."
          suggestion={'Try creating a "home" or "about" page to get started.'}
          action={<button onClick={() => setShowForm(true)} style={emptyActionStyle}>Create Page</button>}
        />
      ) : (
        <div style={styles.grid}>
          {pages.map(page => (
            <PageCard
              key={page.name}
              page={page}
              onEdit={handleEditPage}
              onDuplicate={handleDuplicatePage}
              onDelete={handleDeletePage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, heading, description, suggestion, action }) {
  return (
    <div style={emptyStyles.container}>
      <div style={emptyStyles.icon}>{icon}</div>
      <h3 style={emptyStyles.heading}>{heading}</h3>
      <p style={emptyStyles.description}>{description}</p>
      {suggestion && <p style={emptyStyles.suggestion}>{suggestion}</p>}
      {action && <div style={emptyStyles.action}>{action}</div>}
    </div>
  );
}

const emptyActionStyle = { display: 'inline-flex', alignItems: 'center', padding: '12px 24px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', minHeight: '44px' };

const emptyStyles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 28px', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc', margin: '0 28px', minHeight: '360px' },
  icon: { width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '700', marginBottom: '16px' },
  heading: { margin: '0 0 8px', fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' },
  description: { margin: '0 0 8px', fontSize: '0.875rem', color: '#64748b', maxWidth: '400px', lineHeight: '1.5' },
  suggestion: { margin: '0 0 20px', fontSize: '0.813rem', color: '#94a3b8', fontStyle: 'italic' },
  action: { marginTop: '8px' },
};
