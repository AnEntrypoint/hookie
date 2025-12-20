import React, { useState, useEffect, createContext, useContext } from 'react';
import AdminApp from '../admin/AdminApp.js';
import Router from './Router.js';

export const RepoContext = createContext(null);
export const useRepo = () => useContext(RepoContext);

const ErrorBoundary = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error" style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h1>Something went wrong</h1>
          <pre style={{ textAlign: 'left', overflow: 'auto', maxHeight: '200px' }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }

    return this.props.children;
  }
};

const getRepoInfo = () => {
  let owner = import.meta.env.VITE_GITHUB_OWNER;
  let repo = import.meta.env.VITE_GITHUB_REPO;

  if (!owner || !repo) {
    owner = localStorage.getItem('github_owner');
    repo = localStorage.getItem('github_repo');
  }

  if (!owner || !repo) {
    const params = new URLSearchParams(window.location.search);
    owner = params.get('owner');
    repo = params.get('repo');

    if (owner && repo) {
      localStorage.setItem('github_owner', owner);
      localStorage.setItem('github_repo', repo);
    }
  }

  return { owner: owner || '', repo: repo || '' };
};

const checkIsAdminRoute = () => {
  const path = window.location.pathname;
  const hash = window.location.hash;
  return path.includes('/admin') || hash.includes('/admin');
};

const App = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [repoInfo, setRepoInfo] = useState({ owner: '', repo: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const info = getRepoInfo();
    setRepoInfo(info);

    const isAdmin = checkIsAdminRoute();
    setIsAdminRoute(isAdmin);

    const handleRouteChange = () => {
      const isAdmin = checkIsAdminRoute();
      setIsAdminRoute(isAdmin);
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  }, []);

  const handleConfigSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const owner = formData.get('owner');
    const repo = formData.get('repo');

    if (owner && repo) {
      localStorage.setItem('github_owner', owner);
      localStorage.setItem('github_repo', repo);
      setRepoInfo({ owner, repo });
    }
  };

  if (loading) {
    return (
      <div className="app-loading" style={{
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
        <p>Initializing...</p>
      </div>
    );
  }

  if (!repoInfo.owner || !repoInfo.repo) {
    return (
      <div className="app-config" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'sans-serif',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h1>Configuration Required</h1>
          <p>Please configure your GitHub repository:</p>
          <form onSubmit={handleConfigSubmit}>
            <input
              type="text"
              placeholder="Repository Owner"
              name="owner"
              required
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="text"
              placeholder="Repository Name"
              name="repo"
              required
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </form>
          <p className="hint" style={{
            marginTop: '20px',
            fontSize: '14px',
            color: '#666'
          }}>
            Or set VITE_GITHUB_OWNER and VITE_GITHUB_REPO environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <RepoContext.Provider value={repoInfo}>
      <div className="app">
        {isAdminRoute ? (
          <AdminApp owner={repoInfo.owner} repo={repoInfo.repo} />
        ) : (
          <Router owner={repoInfo.owner} repo={repoInfo.repo} defaultPage="home" />
        )}
      </div>
    </RepoContext.Provider>
  );
};

const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
