import { useState, useEffect } from 'react';
import { github } from '../lib/github.js';
import { GITHUB_OWNER, GITHUB_REPO, CONTENT_PATHS, CACHE_CONFIG } from '../config/siteConfig.js';

const DEFAULT_LAYOUT = {
  version: '1.0.0',
  site: { title: 'Hookie CMS', description: 'Dynamic Page Builder CMS' },
  header: { enabled: true, height: 64 },
  footer: { enabled: true, height: 60 },
  grid: { columns: 12, gap: 16, maxWidth: 1200 },
  colors: { primary: '#2563eb', background: '#ffffff', text: '#1e293b' }
};

export function useLayout() {
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLayout = async () => {
      const cacheKey = 'siteLayout';
      const cacheTimestampKey = 'siteLayoutTimestamp';
      const now = Date.now();

      const cachedLayout = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

      if (cachedLayout && cachedTimestamp) {
        const age = now - parseInt(cachedTimestamp, 10);
        if (age < CACHE_CONFIG.LAYOUT_TTL) {
          try {
            setLayout(JSON.parse(cachedLayout));
            setLoading(false);
            return;
          } catch (e) {
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheTimestampKey);
          }
        }
      }

      try {
        setLoading(true);
        setError(null);
        const response = await github.readFile(GITHUB_OWNER, GITHUB_REPO, CONTENT_PATHS.layout);
        const layoutData = JSON.parse(response.content);
        setLayout(layoutData);
        localStorage.setItem(cacheKey, JSON.stringify(layoutData));
        localStorage.setItem(cacheTimestampKey, now.toString());
      } catch (err) {
        console.error('Failed to load layout from GitHub:', err.message);
        setError(err);
        setLayout(DEFAULT_LAYOUT);
      } finally {
        setLoading(false);
      }
    };

    fetchLayout();
  }, []);

  return { layout, loading, error };
}
