import React, { useState, useEffect } from 'react';
import contentManager from '../lib/contentManager';
import PageCard from './PageCard';
import { styles } from './pageManagerStyles';

export default function PageManager({ owner, repo, onSelectPage }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPages();
  }, [owner, repo]);

  const loadPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageList = await contentManager.listPages(owner, repo);
      // Safe sorting - ensure pageList is array and items have name property
      const sortedPages = Array.isArray(pageList) 
        ? pageList.filter(p => p && p.name).sort((a, b) => a.name.localeCompare(b.name))
        : [];
      setPages(sortedPages);
    } catch (err) {
      setError(err.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();

    if (!newPageName.trim()) {
      setError('Page name is required');
      return;
    }

    const nameRegex = /^[a-z0-9-_]+$/;
    if (!nameRegex.test(newPageName)) {
      setError('Page name must contain only lowercase letters, numbers, hyphens, and underscores');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const pageData = {
        name: newPageName,
        title: formatPageTitle(newPageName),
        components: [
          {
            id: `container-${Date.now()}`,
            type: 'Container',
            props: { maxWidth: '1200px' },
            style: {},
            children: [
              {
                id: `heading-${Date.now()}`,
                type: 'Heading',
                props: {
                  level: 1,
                  children: `Welcome to ${formatPageTitle(newPageName)}`,
                },
                style: {},
                children: [],
              },
            ],
          },
        ],
      };

      await contentManager.savePage(owner, repo, newPageName, pageData);
      await loadPages();
      setNewPageName('');
      setShowForm(false);
      setSubmitting(false);
      onSelectPage({ name: newPageName, data: pageData });
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
      const duplicatedData = {
        ...pageData,
        name: newName,
        title: formatPageTitle(newName),
      };
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

  const formatPageTitle = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
        <button onClick={() => setShowForm(!showForm)} style={styles.newButton}>
          + New Page
        </button>
      </header>

      {showForm && (
        <div style={styles.modalBackdrop} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Create New Page</h3>
            <form onSubmit={handleCreatePage} style={styles.form}>
              <input
                type="text"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value.toLowerCase())}
                placeholder="page-name"
                autoFocus
                style={styles.input}
              />
              <div style={styles.modalActions}>
                <button type="submit" disabled={submitting} style={styles.createButton}>
                  {submitting ? 'Creating...' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={() => setError(null)} style={styles.dismissButton}>
            ×
          </button>
        </div>
      )}

      {pages.length === 0 ? (
        <div style={styles.emptyState}>
          No pages yet. Create your first page!
        </div>
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
