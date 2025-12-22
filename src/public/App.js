import React, { useState, useEffect, createContext, useContext } from 'react';
import AppLayout from './AppLayout.js';
import Router from './Router.js';
import AdminApp from '../admin/AdminApp.js';
import { getCurrentRoute, isAdminRoute as checkAdminRoute, addRouteChangeListener } from './AppRoutes.js';

export const RepoContext = createContext(null);

export function useRepo() {
  return useContext(RepoContext);
}

function getRepoInfo() {
  let owner = import.meta.env.VITE_GITHUB_OWNER;
  let repo = import.meta.env.VITE_GITHUB_REPO;
  
  if (!owner || !repo) {
    owner = localStorage.getItem('github_owner');
    repo = localStorage.getItem('github_repo');
  }
  
  if (!owner || !repo) {
    const params = new URLSearchParams(window.location.search);
    const urlOwner = params.get('owner');
    const urlRepo = params.get('repo');

    if (urlOwner && urlRepo) {
      owner = urlOwner;
      repo = urlRepo;
      localStorage.setItem('github_owner', owner);
      localStorage.setItem('github_repo', repo);
    }
  }
  
  return { owner: owner || '', repo: repo || '' };
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [repoInfo, setRepoInfo] = useState({ owner: '', repo: '' });

  useEffect(() => {
    const currentRoute = getCurrentRoute();
    setIsAdminRoute(checkAdminRoute(currentRoute));
    
    const cleanup = addRouteChangeListener((route) => {
      setIsAdminRoute(checkAdminRoute(route));
    });
    
    return cleanup;
  }, []);

  useEffect(() => {
    const info = getRepoInfo();
    setRepoInfo(info);
  }, []);

  function handleConfigSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const owner = formData.get('owner');
    const repo = formData.get('repo');
    
    if (owner && repo) {
      localStorage.setItem('github_owner', owner);
      localStorage.setItem('github_repo', repo);
      setRepoInfo({ owner, repo });
    }
  }

  if (!repoInfo.owner || !repoInfo.repo) {
    return (
      <div style={styles.configContainer}>
        <div style={styles.configBox}>
          <h1 style={styles.configTitle}>Repository Configuration</h1>
          <p style={styles.configText}>
            Please configure your GitHub repository to get started.
          </p>
          
          <form onSubmit={handleConfigSubmit} style={styles.configForm}>
            <input
              type="text"
              name="owner"
              placeholder="Repository Owner"
              required
              style={styles.input}
            />
            <input
              type="text"
              name="repo"
              placeholder="Repository Name"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.submitButton}>
              Save Configuration
            </button>
          </form>
          
          <p style={styles.hint}>
            Alternatively, set VITE_GITHUB_OWNER and VITE_GITHUB_REPO environment variables.
          </p>
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
          <Router owner={repoInfo.owner} repo={repoInfo.repo} defaultPage="home" />
        </AppLayout>
      )}
    </RepoContext.Provider>
  );
}

const styles = {
  configContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '2rem'
  },
  
  configBox: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '3rem',
    maxWidth: '500px',
    width: '100%'
  },
  
  configTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#1e293b'
  },
  
  configText: {
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '2rem'
  },
  
  configForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  
  submitButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  
  hint: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    marginTop: '1.5rem',
    textAlign: 'center'
  }
};
