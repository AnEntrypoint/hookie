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

const Router = ({ owner, repo, defaultPage = 'home' }) => {
  const [currentPage, setCurrentPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const pageCache = useRef({});

  const getPageNameFromHash = () => {
    const hash = window.location.hash;
    const pageName = hash.replace(/^#\/?/, '') || defaultPage;
    return pageName;
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
      <div className="router-loading" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'sans-serif'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading page...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="router-error" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'sans-serif',
        textAlign: 'center'
      }}>
        <h1>Error</h1>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reload
        </button>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="router-404" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'sans-serif',
        textAlign: 'center'
      }}>
        <h1>404</h1>
        <p>Page not found</p>
        <a
          href="#/"
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          Go to home page
        </a>
      </div>
    );
  }

  if (currentPage) {
    return (
      <div className="router" style={{
        opacity: loading ? 0.5 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        <Renderer pageData={currentPage} mode="view" />
      </div>
    );
  }

  return null;
};

export default Router;
