import React, { useState, useEffect } from 'react';

const Settings = ({ onSettingsSaved }) => {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token') || '';
    const savedOwner = localStorage.getItem('repo_owner') || '';
    const savedRepo = localStorage.getItem('repo_name') || '';

    setToken(savedToken);
    setOwner(savedOwner);
    setRepo(savedRepo);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!token.trim()) {
      setError('GitHub personal access token is required');
      return;
    }

    if (!owner.trim()) {
      setError('Repository owner is required');
      return;
    }

    if (!repo.trim()) {
      setError('Repository name is required');
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem('github_token', token);
      localStorage.setItem('repo_owner', owner);
      localStorage.setItem('repo_name', repo);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (onSettingsSaved) {
        onSettingsSaved({ token, owner, repo });
      }
    } catch (err) {
      setError('Failed to save settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setToken('');
    setOwner('');
    setRepo('');
    localStorage.removeItem('github_token');
    localStorage.removeItem('repo_owner');
    localStorage.removeItem('repo_name');
    setError(null);
    setSuccess(false);
  };

  const colors = {
    textDark: '#1e293b',
    textLight: '#64748b',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    white: '#ffffff',
    primary: '#2563eb',
    primaryDark: '#1e40af',
    danger: '#ef4444',
    success: '#10b981',
    background: '#f8fafc',
    errorBg: '#fee2e2',
    errorBorder: '#ef4444',
    errorText: '#7f1d1d',
    successBg: '#dcfce7',
    successBorder: '#10b981',
    successText: '#166534',
  };

  const styles = {
    container: {
      maxWidth: '700px',
      margin: '0 auto',
      padding: '40px 28px',
    },
    header: {
      marginBottom: '40px',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 800,
      color: colors.textDark,
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px',
    },
    description: {
      fontSize: '0.95rem',
      color: colors.textLight,
      margin: 0,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textDark,
    },
    labelHelper: {
      fontSize: '0.8125rem',
      color: colors.textMuted,
      fontWeight: 400,
    },
    input: {
      padding: '12px 16px',
      fontSize: '0.95rem',
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: colors.white,
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      color: colors.textDark,
    },
    inputFocus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 4px rgba(37, 99, 235, 0.12)`,
      outline: 'none',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
    },
    button: {
      flex: 1,
      padding: '12px 20px',
      fontSize: '0.95rem',
      fontWeight: 600,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    primaryButton: {
      backgroundColor: colors.primary,
      color: colors.white,
    },
    primaryButtonHover: {
      backgroundColor: colors.primaryDark,
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    },
    secondaryButton: {
      backgroundColor: colors.background,
      color: colors.textLight,
      border: `1px solid ${colors.border}`,
    },
    secondaryButtonHover: {
      backgroundColor: colors.border,
    },
    errorAlert: {
      backgroundColor: colors.errorBg,
      border: `2px solid ${colors.errorBorder}`,
      borderRadius: '8px',
      padding: '12px 16px',
      color: colors.errorText,
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    successAlert: {
      backgroundColor: colors.successBg,
      border: `2px solid ${colors.successBorder}`,
      borderRadius: '8px',
      padding: '12px 16px',
      color: colors.successText,
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.description}>Configure your GitHub repository for content management</p>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={styles.successAlert}>
          <span>✓</span>
          <span>Settings saved successfully</span>
        </div>
      )}

      <form style={styles.form} onSubmit={handleSave}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            GitHub Personal Access Token
            <div style={styles.labelHelper}>Create one at github.com/settings/tokens</div>
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: colors.border, boxShadow: 'none' })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Repository Owner
            <div style={styles.labelHelper}>GitHub username or organization</div>
          </label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="your-github-username"
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: colors.border, boxShadow: 'none' })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Repository Name
            <div style={styles.labelHelper}>Name of your content repository</div>
          </label>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="my-content-repo"
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, { borderColor: colors.border, boxShadow: 'none' })}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={{ ...styles.button, ...styles.primaryButton }}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.primaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.primaryButton)}
            disabled={loading}
          >
            {loading ? '⟳ Saving...' : '✓ Save Settings'}
          </button>
          <button
            type="button"
            style={{ ...styles.button, ...styles.secondaryButton }}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.secondaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.secondaryButton)}
            onClick={handleReset}
          >
            ⟳ Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
