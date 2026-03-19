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
    <div className="min-h-screen bg-backgroundSecondary font-sans">
      <div className="max-w-3xl mx-auto px-8 py-20 text-center">
        <div className="text-5xl mb-6">🪝</div>
        <h1 className="text-5xl font-extrabold text-content1 mb-4 tracking-tight">Hookie CMS</h1>
        <p className="text-xl text-content2 mb-12 leading-relaxed max-w-xl mx-auto">
          Build websites visually and store everything in GitHub. No servers, no databases — just your repo.
        </p>
        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <a href="#/admin/settings" className="btn btn-primary btn-lg">Get Started →</a>
          <a href="#/admin" className="btn btn-outline btn-lg">Open Admin</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { icon: '🎨', title: 'Visual Builder', desc: 'Drag and drop components to build pages without writing code.' },
            { icon: '🐙', title: 'GitHub Storage', desc: 'Pages stored as JSON in your repo. Full git history and version control.' },
            { icon: '🧩', title: '19 Components', desc: 'Hero, Card, Grid, Testimonial, PricingCard, ContactForm and more.' },
            { icon: '⚡', title: 'No Build Step', desc: 'Deploy to GitHub Pages or any static host. Zero configuration.' },
          ].map((f, i) => (
            <div key={i} className="card card-bordered p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-content1 mb-2">{f.title}</h3>
              <p className="text-sm text-content2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
