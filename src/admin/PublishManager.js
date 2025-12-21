import React, { useState, useEffect } from 'react';

const PublishManager = ({ owner = 'owner', repo = 'repo', changes = [] }) => {
  const [commitMessage, setCommitMessage] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [lastCommit, setLastCommit] = useState(null);
  const [error, setError] = useState(null);
  const [expandedDiffs, setExpandedDiffs] = useState(new Set());

  useEffect(() => {
    if (lastCommit) {
      const timer = setTimeout(() => setLastCommit(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastCommit]);

  const toggleDiff = (index) => {
    const newExpanded = new Set(expandedDiffs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDiffs(newExpanded);
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 600,
      marginRight: '12px',
    };

    const statusStyles = {
      added: { background: '#dcfce7', color: '#166534' },
      modified: { background: '#fef08a', color: '#854d0e' },
      deleted: { background: '#fee2e2', color: '#991b1b' },
    };

    return { ...baseStyle, ...(statusStyles[status] || statusStyles.modified) };
  };

  const handlePublish = async () => {
    if (!commitMessage.trim()) {
      setError('Commit message is required');
      return;
    }

    if (commitMessage.length < 10) {
      setError('Commit message should be at least 10 characters');
      return;
    }

    setPublishing(true);
    setError(null);

    try {
      const timestamp = new Date().toISOString();
      setLastCommit({
        sha: 'abc1234567890def1234567890def12345678',
        message: commitMessage,
        author: 'GitHub User',
        timestamp: timestamp,
      });

      setCommitMessage('');
    } catch (err) {
      setError(err.message || 'Failed to publish changes');
    } finally {
      setPublishing(false);
    }
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px',
      background: '#ffffff',
      borderRadius: '12px',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },

    title: {
      fontSize: '1.875rem',
      fontWeight: 800,
      color: '#1e293b',
      letterSpacing: '-0.4px',
      marginBottom: '32px',
      textShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },

    emptyState: {
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },

    emptyIcon: {
      width: '64px',
      height: '64px',
      marginBottom: '16px',
    },

    emptyTitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1e293b',
      marginBottom: '8px',
    },

    emptySubtitle: {
      fontSize: '1rem',
      color: '#64748b',
    },

    changesSection: {
      padding: '32px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      marginBottom: '32px',
      background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },

    sectionTitle: {
      fontSize: '1.875rem',
      fontWeight: 800,
      color: '#1e293b',
      letterSpacing: '-0.4px',
      marginBottom: '20px',
      textShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },

    changeItem: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      border: '2px solid transparent',
      borderRadius: '12px',
      background: '#f8fafc',
      marginBottom: '16px',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    },

    changeItemHover: {
      background: '#f1f5f9',
      borderColor: '#2563eb',
      transform: 'translateY(-2px)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },

    changeHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
    },

    changePath: {
      fontFamily: "'Monaco', 'Courier New', monospace",
      fontSize: '0.875rem',
      color: '#1e293b',
      wordBreak: 'break-all',
      marginLeft: '12px',
      background: 'transparent',
      border: 'none',
      padding: '0',
    },

    diffDetails: {
      marginTop: '12px',
    },

    diffSummary: {
      cursor: 'pointer',
      fontSize: '0.875rem',
      color: '#2563eb',
      fontWeight: '500',
      padding: '8px',
      userSelect: 'none',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    diffCode: {
      marginTop: '12px',
      padding: '12px',
      background: '#1e293b',
      borderRadius: '4px',
      overflow: 'auto',
      fontFamily: "'Monaco', 'Courier New', monospace",
      fontSize: '0.875rem',
      color: '#cbd5e1',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    },

    commitSection: {
      marginBottom: '32px',
    },

    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '12px',
      fontFamily: "'Monaco', 'Courier New', monospace",
      fontSize: '0.875rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      resize: 'vertical',
      background: '#ffffff',
      color: '#1e293b',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      boxSizing: 'border-box',
      outline: 'none',
    },

    textareaFocus: {
      borderColor: '#2563eb',
      boxShadow: 'inset 0 0 0 1px #2563eb, 0 0 0 3px rgba(37, 99, 235, 0.1)',
    },

    commitInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '8px',
      marginBottom: '16px',
    },

    charCount: {
      fontSize: '0.75rem',
      color: '#64748b',
    },

    warning: {
      fontSize: '0.75rem',
      color: '#f59e0b',
    },

    errorMessage: {
      padding: '12px',
      background: '#fee2e2',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      color: '#991b1b',
      fontSize: '0.875rem',
      marginBottom: '16px',
    },

    publishButton: {
      width: '100%',
      padding: '12px 24px',
      background: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
    },

    publishButtonHover: {
      background: '#1d4ed8',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    },

    publishButtonDisabled: {
      background: '#cbd5e1',
      color: '#94a3b8',
      cursor: 'not-allowed',
      transform: 'none',
    },

    successState: {
      background: '#ecfdf5',
      border: '2px solid #10b981',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '24px',
      animation: 'slideIn 300ms ease-out',
    },

    successIcon: {
      width: '48px',
      height: '48px',
      background: '#10b981',
      color: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },

    successTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#065f46',
      marginBottom: '12px',
    },

    successInfo: {
      fontSize: '0.875rem',
      color: '#047857',
      lineHeight: '1.6',
    },

    successLink: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: 600,
    },

    successLinkHover: {
      textDecoration: 'underline',
    },

    commitMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '8px',
      fontSize: '0.75rem',
      color: '#6b7280',
    },
  };

  if (changes.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Publish Changes</h2>
        <div style={styles.emptyState}>
          <svg
            style={styles.emptyIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 style={styles.emptyTitle}>All changes published</h3>
          <p style={styles.emptySubtitle}>No pending changes. Keep building!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Publish Changes</h2>

      <div style={styles.changesSection}>
        <h3 style={styles.sectionTitle}>Changed Files ({changes.length})</h3>

        {changes.map((change, index) => (
          <div
            key={index}
            style={styles.changeItem}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.changeItemHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = styles.changeItem.background;
              e.currentTarget.style.borderColor = styles.changeItem.borderColor;
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.changeHeader}>
              <span style={getStatusBadgeStyle(change.status)}>
                {change.status.toUpperCase()}
              </span>
              <code style={styles.changePath}>{change.path}</code>
            </div>

            {change.diff && (
              <details style={styles.diffDetails}>
                <summary
                  style={styles.diffSummary}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDiff(index);
                  }}
                >
                  {expandedDiffs.has(index) ? 'Hide diff' : 'View diff'}
                </summary>
                {expandedDiffs.has(index) && (
                  <pre style={styles.diffCode}>{change.diff}</pre>
                )}
              </details>
            )}
          </div>
        ))}
      </div>

      <div style={styles.commitSection}>
        <h3 style={styles.sectionTitle}>Commit Message</h3>

        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Describe your changes..."
          style={styles.textarea}
          onFocus={(e) => {
            Object.assign(e.currentTarget.style, styles.textareaFocus);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        <div style={styles.commitInfo}>
          <span style={styles.charCount}>{commitMessage.length} characters</span>
          {commitMessage.length < 10 && commitMessage.length > 0 && (
            <span style={styles.warning}>
              Commit message should be descriptive (at least 10 characters)
            </span>
          )}
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button
          style={{
            ...styles.publishButton,
            ...(publishing || !commitMessage.trim() || commitMessage.length < 10
              ? styles.publishButtonDisabled
              : {}),
          }}
          onClick={handlePublish}
          disabled={publishing || !commitMessage.trim() || commitMessage.length < 10}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              Object.assign(e.currentTarget.style, styles.publishButtonHover);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {publishing ? 'Publishing...' : 'Publish to GitHub'}
        </button>
      </div>

      {lastCommit && (
        <div style={styles.successState}>
          <div style={styles.successIcon}>✓</div>
          <h3 style={styles.successTitle}>Published Successfully</h3>
          <div style={styles.successInfo}>
            <div>
              <strong>Commit:</strong>{' '}
              <a
                href={`https://github.com/${owner}/${repo}/commit/${lastCommit.sha}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.successLink}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.successLinkHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {lastCommit.sha.substring(0, 7)}
              </a>
            </div>
            <div style={{ marginTop: '8px' }}>
              <strong>Message:</strong> {lastCommit.message}
            </div>
            <div style={styles.commitMeta}>
              <span>{lastCommit.author}</span>
              <span>{new Date(lastCommit.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishManager;
