import React, { useState, useEffect } from 'react';
import { github } from '../lib/github.js';

const Auth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      alert('GitHub OAuth not configured. Create an OAuth app at github.com/settings/developers and set the Client ID in settings.');
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
        <button className="auth-login" onClick={handleLogin}>
          Sign in with GitHub
        </button>
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
