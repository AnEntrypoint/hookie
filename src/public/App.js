import React, { useState, useEffect, createContext, useContext } from 'react';
import AppLayout from './AppLayout.js';
import Router from './Router.js';
import AdminApp from '../admin/AdminApp.js';
import { getCurrentRoute, isAdminRoute as checkAdminRoute, addRouteChangeListener } from './AppRoutes.js';
import { useLayout } from '../lib/useLayout.js';
import { KEYS, migrateStorageKeys } from '../admin/settingsStorage.js';

export const RepoContext = createContext(null);

export function useRepo() {
  return useContext(RepoContext);
}

function getRepoInfo() {
  migrateStorageKeys();
  let owner = import.meta.env.VITE_GITHUB_OWNER;
  let repo = import.meta.env.VITE_GITHUB_REPO;
  if (!owner || !repo) {
    owner = localStorage.getItem(KEYS.owner);
    repo = localStorage.getItem(KEYS.repo);
  }
  if (!owner || !repo) {
    const params = new URLSearchParams(window.location.search);
    const uo = params.get('owner'), ur = params.get('repo');
    if (uo && ur) {
      owner = uo; repo = ur;
      localStorage.setItem(KEYS.owner, owner);
      localStorage.setItem(KEYS.repo, repo);
    }
  }
  return { owner: owner || '', repo: repo || '' };
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [repoInfo, setRepoInfo] = useState({ owner: '', repo: '' });
  const { layout, loading: layoutLoading } = useLayout(repoInfo.owner || '', repoInfo.repo || '');

  useEffect(() => {
    setIsAdminRoute(checkAdminRoute(getCurrentRoute()));
    return addRouteChangeListener((route) => setIsAdminRoute(checkAdminRoute(route)));
  }, []);

  useEffect(() => { setRepoInfo(getRepoInfo()); }, []);

  if (!repoInfo.owner || !repoInfo.repo) {
    return <WelcomePage />;
  }

  return (
    <RepoContext.Provider value={repoInfo}>
      {isAdminRoute ? (
        <AdminApp />
      ) : (
        <AppLayout repoInfo={repoInfo} showAdmin={true}>
          <Router owner={repoInfo.owner} repo={repoInfo.repo} defaultPage="home" layout={layout} />
        </AppLayout>
      )}
    </RepoContext.Provider>
  );
}

function WelcomePage() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🪝</div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b', margin: '0 0 16px', letterSpacing: '-1px' }}>
          Hookie CMS
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', margin: '0 0 48px', lineHeight: 1.6, maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
          Build websites visually and store everything in GitHub. No servers, no databases — just your repo.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
          <a href="#/admin/settings" style={ctaBtn}>
            Get Started →
          </a>
          <a href="#/admin" style={secondaryBtn}>
            Open Admin
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'left' }}>
          {[
            { icon: '🎨', title: 'Visual Builder', desc: 'Drag and drop components to build pages without writing code.' },
            { icon: '🐙', title: 'GitHub Storage', desc: 'Pages stored as JSON in your repo. Full git history and version control.' },
            { icon: '🧩', title: '19 Components', desc: 'Hero, Card, Grid, Testimonial, PricingCard, ContactForm and more.' },
            { icon: '⚡', title: 'No Build Step', desc: 'Deploy to GitHub Pages or any static host. Zero configuration.' },
          ].map((f, i) => (
            <div key={i} style={featureCard}>
              <div style={{ fontSize: '1.75rem', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ctaBtn = {
  display: 'inline-flex', alignItems: 'center', padding: '16px 32px',
  backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px',
  textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
  boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
};

const secondaryBtn = {
  display: 'inline-flex', alignItems: 'center', padding: '16px 32px',
  backgroundColor: '#ffffff', color: '#1e293b', borderRadius: '12px',
  textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
  border: '2px solid #e2e8f0',
};

const featureCard = {
  backgroundColor: '#ffffff', borderRadius: '12px',
  padding: '24px', border: '1px solid #e2e8f0',
};
