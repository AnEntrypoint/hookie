import { useState, useEffect } from 'react';
import * as pageManager from './pageManager.js';

const DEFAULT_LAYOUT = {
  version: '1.0.0',
  site: {
    title: 'Hookie CMS',
    description: 'Dynamic Page Builder CMS',
    theme: 'light'
  },
  header: {
    enabled: true,
    height: '64px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky',
    padding: '0.75rem 1rem',
    items: [
      {
        type: 'logo',
        text: 'Hookie'
      },
      {
        type: 'nav',
        links: [
          { label: 'Home', path: '/' },
          { label: 'Pages', path: '/pages' },
          { label: 'Components', path: '/components' }
        ]
      }
    ]
  },
  footer: {
    enabled: true,
    height: '60px',
    backgroundColor: '#f5f5f5',
    color: '#64748b',
    borderTop: '1px solid #e0e0e0',
    padding: '2rem 1rem',
    sections: [
      {
        title: 'Copyright',
        text: 'Copyright 2026 Hookie CMS. All rights reserved.'
      }
    ]
  },
  page: {
    maxWidth: '100%',
    padding: '1rem'
  }
};

export function useLayout(owner, repo) {
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!owner || !repo) {
      setLayout(DEFAULT_LAYOUT);
      setLoading(false);
      return;
    }

    const loadLayout = async () => {
      try {
        setLoading(true);
        const layoutData = await pageManager.loadLayout(owner, repo);
        if (layoutData) {
          setLayout(layoutData);
        } else {
          setLayout(DEFAULT_LAYOUT);
        }
      } catch (err) {
        setError(err.message);
        setLayout(DEFAULT_LAYOUT);
      } finally {
        setLoading(false);
      }
    };

    loadLayout();
  }, [owner, repo]);

  return { layout, loading, error, DEFAULT_LAYOUT };
}
