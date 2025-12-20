import React, { useState, useEffect } from 'react';
import { github } from '../lib/github.js';

const Auth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = github.getAuthToken();

        if (token) {
          try {
            const userData = await github.getUser();
            setIsAuthenticated(true);
            setUser(userData);
          } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      await github.initiateOAuthLogin();
    } catch (error) {
      console.error('OAuth login failed:', error);
      setShowTokenInput(true);
    }
  };

  const handleTokenSubmit = async () => {
    if (!tokenInput.trim()) return;
    sessionStorage.setItem('github_token', tokenInput.trim());
    try {
      const userData = await github.getUser();
      setIsAuthenticated(true);
      setUser(userData);
      setShowTokenInput(false);
      setTokenInput('');
    } catch (error) {
      console.error('Token validation failed:', error);
      alert('Invalid token. Please try again.');
      sessionStorage.removeItem('github_token');
    }
  };

  const handleLogout = () => {
    github.logout();
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="auth">
        {showTokenInput ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px' }}>
            <input
              type="password"
              placeholder="GitHub Personal Access Token (repo scope)"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
              title="Create a token at: github.com/settings/tokens"
              style={{
                padding: '8px 12px',
                fontSize: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '220px'
              }}
            />
            <button
              onClick={handleTokenSubmit}
              style={{
                padding: '8px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                setShowTokenInput(false);
                setTokenInput('');
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="auth-login" onClick={handleLogin}>
            Sign in with GitHub
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="auth auth-authenticated">
      <img
        className="auth-avatar"
        src={user.avatar_url}
        alt={user.login}
        style={{ width: '32px', height: '32px', borderRadius: '50%' }}
      />
      <span className="auth-username">{user.name || user.login}</span>
      <button className="auth-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Auth;
