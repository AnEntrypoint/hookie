import React, { useState, useEffect, createContext, useContext } from 'react';
import AppLayout from './AppLayout.js';
import Router from './Router.js';
import AdminApp from '../admin/AdminApp.js';
import { getCurrentRoute, isAdminRoute as checkAdminRoute, addRouteChangeListener } from './AppRoutes.js';
import { useLayout } from '../lib/useLayout.js';
import { KEYS, migrateStorageKeys } from '../admin/settingsStorage.js';
import { styles as S, colors } from '../admin/settingsStyles.js';

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

  function handleConfigSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const owner = fd.get('owner'), repo = fd.get('repo');
    if (owner && repo) {
      localStorage.setItem(KEYS.owner, owner);
      localStorage.setItem(KEYS.repo, repo);
      setRepoInfo({ owner, repo });
    }
  }

  if (!repoInfo.owner || !repoInfo.repo) {
    return (
      <div style={configStyles.container}>
        <div style={configStyles.box}>
          <h1 style={S.title}>Repository Configuration</h1>
          <p style={S.description}>Connect to your GitHub repository to load your site content.</p>
          <form onSubmit={handleConfigSubmit} style={S.form}>
            <div style={S.formGroup}>
              <label style={S.label}>Repository Owner</label>
              <input type="text" name="owner" placeholder="your-username" required style={S.input} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Repository Name</label>
              <input type="text" name="repo" placeholder="my-site" required style={S.input} />
            </div>
            <button type="submit" style={{ ...S.button, ...S.primaryButton, marginTop: '8px' }}>Save Configuration</button>
          </form>
          <p style={configStyles.hint}>You can also set VITE_GITHUB_OWNER and VITE_GITHUB_REPO environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <RepoContext.Provider value={repoInfo}>
      {isAdminRoute ? (
        <AdminApp owner={repoInfo.owner} repo={repoInfo.repo} />
      ) : (
        <AppLayout repoInfo={repoInfo} showAdmin={true}>
          <Router owner={repoInfo.owner} repo={repoInfo.repo} defaultPage="home" layout={layout} />
        </AppLayout>
      )}
    </RepoContext.Provider>
  );
}

const configStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: '2rem',
  },
  box: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '3rem',
    maxWidth: '500px',
    width: '100%',
  },
  hint: {
    fontSize: '0.8rem',
    color: colors.textMuted,
    marginTop: '1.5rem',
    textAlign: 'center',
  },
};
