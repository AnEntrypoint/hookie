import React, { useState, useEffect } from 'react';
import {
  loadSettingsFromStorage,
  saveSettingsToStorage,
  clearSettingsFromStorage
} from './settingsStorage';
import { styles, colors } from './settingsStyles';
import './admin.css';

const Settings = ({ onUpdate, repoInfo }) => {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const settings = loadSettingsFromStorage();
    setToken(settings.token);
    setOwner(settings.owner);
    setRepo(settings.repo);
  }, []);

  useEffect(() => {
    if (repoInfo?.owner && repoInfo?.repo) {
      setOwner(repoInfo.owner);
      setRepo(repoInfo.repo);
    }
  }, [repoInfo]);

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
      saveSettingsToStorage(token, owner, repo);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (onUpdate) {
        onUpdate({ owner, repo });
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
    clearSettingsFromStorage();
    setError(null);
    setSuccess(false);
  };

  return (
    <div style={styles.container} className="settings-container">
      <div style={styles.header} className="settings-header">
        <h1 style={styles.title} className="settings-title">Settings</h1>
        <p style={styles.description} className="settings-description">Configure your GitHub repository for content management</p>
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
            <div style={styles.labelHelper} className="settings-label-helper">Create one at github.com/settings/tokens</div>
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
            <div style={styles.labelHelper} className="settings-label-helper">GitHub username or organization</div>
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
            <div style={styles.labelHelper} className="settings-label-helper">Name of your content repository</div>
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

        <div style={styles.buttonGroup} className="settings-button-group">
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
