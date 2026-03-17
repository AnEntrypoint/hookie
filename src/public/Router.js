import React, { useState, useEffect, useRef } from 'react';
import Renderer from './Renderer.js';
import contentManager from '../lib/contentManager.js';

const FALLBACK_PAGES = {
  about: {
    title: 'About',
    meta: { description: 'About our site' },
    components: [
      {
        id: 'about-section',
        type: 'Section',
        props: { title: 'About Us' },
        children: [
          {
            id: 'about-text',
            type: 'Text',
            props: { content: 'This is a placeholder About page. Configure your GitHub repository to customize this content.' }
          }
        ]
      }
    ]
  },
  contact: {
    title: 'Contact',
    meta: { description: 'Contact us' },
    components: [
      {
        id: 'contact-section',
        type: 'Section',
        props: { title: 'Contact Us' },
        children: [
          {
            id: 'contact-text',
            type: 'Text',
            props: { content: 'This is a placeholder Contact page. Configure your GitHub repository to customize this content.' }
          }
        ]
      }
    ]
  }
};

const Router = ({ owner, repo, defaultPage = 'home', layout }) => {
  const [currentPage, setCurrentPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const pageCache = useRef({});

  const getPageNameFromHash = () => {
    const hash = window.location.hash;
    const path = hash.replace(/^#\/?/, '') || defaultPage;
    // Extract page name from /pages/demo format
    const match = path.match(/pages\/(.+)$/);
    return match ? match[1] : path;
  };

  const loadPageWithCache = async (pageName) => {
    if (pageCache.current[pageName]) {
      return pageCache.current[pageName];
    }

    const pageData = await contentManager.loadPage(owner, repo, pageName);
    if (pageData) {
      pageCache.current[pageName] = pageData;
    }

    return pageData;
  };

  const loadPage = async () => {
    const pageName = getPageNameFromHash();

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      let pageData = await loadPageWithCache(pageName);

      if (pageData) {
        setCurrentPage(pageData);
      } else if (FALLBACK_PAGES[pageName]) {
        // Use fallback for pages like "about" and "contact"
        setCurrentPage(FALLBACK_PAGES[pageName]);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      // If GitHub API fails, try fallback pages
      if (FALLBACK_PAGES[pageName]) {
        setCurrentPage(FALLBACK_PAGES[pageName]);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();

    const handleHashChange = () => {
      loadPage();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [owner, repo, defaultPage]);

  useEffect(() => {
    if (currentPage && currentPage.title) {
      document.title = currentPage.title;
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage && currentPage.meta) {
      const description = document.querySelector('meta[name="description"]');
      if (description && currentPage.meta.description) {
        description.setAttribute('content', currentPage.meta.description);
      }
    }
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (loading) {
    return (
      <div style={pageStates.center}>
        <div style={pageStates.spinner} />
        <p style={{ color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>Loading page...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStates.center}>
        <div style={pageStates.icon}>!</div>
        <h1 style={pageStates.heading}>Something went wrong</h1>
        <p style={pageStates.desc}>{error}</p>
        <button onClick={() => window.location.reload()} style={pageStates.btn}>Reload</button>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={pageStates.center}>
        <div style={pageStates.icon}>?</div>
        <h1 style={pageStates.heading}>Page not found</h1>
        <p style={pageStates.desc}>This page does not exist or may have been moved.</p>
        <a href="#/" style={pageStates.link}>Go to home page</a>
      </div>
    );
  }

  if (currentPage) {
    return <Renderer pageData={currentPage} mode="view" layout={layout} />;
  }

  return null;
};

const pageStates = {
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', textAlign: 'center' },
  spinner: { width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '16px' },
  icon: { width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' },
  heading: { margin: '0 0 8px', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' },
  desc: { margin: '0 0 24px', fontSize: '0.875rem', color: '#64748b', maxWidth: '360px', lineHeight: '1.5' },
  btn: { padding: '12px 24px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' },
  link: { padding: '12px 24px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' },
};

export default Router;
