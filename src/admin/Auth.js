import React, { useState, useEffect } from 'react';
import github from '../lib/github.js';

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
        <a
          href="#/admin/settings"
          style={{
            textDecoration: 'none',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 14px',
            minHeight: '32px',
            backgroundColor: '#2563eb',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '0.8125rem',
            transition: 'background-color 150ms'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Add GitHub Token
        </a>
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
      <button
        onClick={handleLogout}
        style={{
          padding: '6px 12px',
          minHeight: '32px',
          backgroundColor: 'transparent',
          color: '#ef4444',
          border: '1px solid #fca5a5',
          borderRadius: '6px',
          fontWeight: '500',
          fontSize: '0.8125rem',
          cursor: 'pointer',
          transition: 'all 150ms'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
      >
        Logout
      </button>
    </div>
  );
};

export default Auth;
