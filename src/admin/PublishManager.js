import React, { useState } from 'react';
import ChangesList from './ChangesList';
import CommitForm from './CommitForm';
import PublishStatus from './PublishStatus';
import * as github from '../lib/github';

const PublishManager = ({ owner, repo, changes, onRefresh }) => {
  const [commitMessage, setCommitMessage] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [lastCommit, setLastCommit] = useState(null);
  const [error, setError] = useState(null);
  const [expandedDiffs, setExpandedDiffs] = useState(new Set());
  const [status, setStatus] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleToggleDiff = (path) => {
    setExpandedDiffs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handlePublishClick = () => {
    if (!commitMessage || commitMessage.trim().length < 10) {
      setError('Commit message must be at least 10 characters');
      setStatus('error');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handlePublish = async () => {
    setShowConfirmDialog(false);
    setPublishing(true);
    setError(null);
    setStatus(null);

    try {
      for (const change of changes) {
        if (change.status === 'deleted') {
          await github.deleteFile(owner, repo, change.path, commitMessage, change.sha);
        } else {
          await github.writeFile(owner, repo, change.path, change.content, commitMessage, change.sha);
        }
      }

      const branchInfo = await github.getBranchInfo(owner, repo, 'main');
      const commitInfo = {
        sha: branchInfo.commit.sha,
        message: commitMessage,
        timestamp: new Date().toISOString(),
        url: branchInfo.commit.url
      };

      setLastCommit(commitInfo);
      setCommitMessage('');
      setStatus('success');

      setTimeout(() => {
        setStatus(null);
        setLastCommit(null);
      }, 5000);

      if (onRefresh) {
        onRefresh();
      }

    } catch (err) {
      let errorMessage = err.message || 'Failed to publish. Please try again.';

      if (err.message?.includes('401') || err.message?.includes('403')) {
        errorMessage = 'Authentication failed. Please re-authenticate.';
      } else if (err.message?.includes('404')) {
        errorMessage = 'Repository not found. Check owner and repo settings.';
      } else if (err.message?.includes('429')) {
        errorMessage = 'GitHub API rate limit exceeded. Try again in a few minutes.';
      } else if (err.message?.includes('Network')) {
        errorMessage = 'Network error. Check your connection.';
      }

      setError(errorMessage);
      setStatus('error');
    } finally {
      setPublishing(false);
    }
  };

  const handleDismiss = () => {
    setStatus(null);
    setError(null);
    setLastCommit(null);
  };

  const handleRetry = () => {
    setStatus(null);
    setError(null);
    handlePublishClick();
  };

  if (!changes || changes.length === 0) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>
          All Changes Published
        </h2>
        <p style={{ color: '#64748b' }}>
          No pending changes to publish
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '32px',
        color: '#1e293b'
      }}>
        Publish Changes
      </h2>

      <PublishStatus
        status={status}
        lastCommit={lastCommit}
        error={error}
        onDismiss={handleDismiss}
        onRetry={handleRetry}
      />

      <ChangesList
        changes={changes}
        expandedDiffs={expandedDiffs}
        onToggleDiff={handleToggleDiff}
      />

      <CommitForm
        commitMessage={commitMessage}
        onChange={setCommitMessage}
        onPublish={handlePublishClick}
        publishing={publishing}
        disabled={false}
        changesCount={changes.length}
      />

      {showConfirmDialog && (
        <div style={confirmStyles.overlay}>
          <div style={confirmStyles.dialog}>
            <h3 style={confirmStyles.title}>Confirm Publish</h3>
            <p style={confirmStyles.text}>Publish these changes to GitHub?</p>
            <ul style={confirmStyles.list}>
              {changes.map(c => (
                <li key={c.path} style={confirmStyles.listItem}>{c.status}: {c.path}</li>
              ))}
            </ul>
            <p style={confirmStyles.commitMsg}>Commit message: "{commitMessage}"</p>
            <div style={confirmStyles.actions}>
              <button onClick={handlePublish} style={confirmStyles.confirmButton}>Publish</button>
              <button onClick={() => setShowConfirmDialog(false)} style={confirmStyles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const confirmStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  dialog: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
  title: { margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' },
  text: { margin: '0 0 16px 0', color: '#64748b' },
  list: { margin: '0 0 16px 0', paddingLeft: '20px', color: '#475569', fontSize: '0.875rem' },
  listItem: { marginBottom: '4px' },
  commitMsg: { margin: '0 0 20px 0', fontStyle: 'italic', color: '#64748b', fontSize: '0.875rem' },
  actions: { display: 'flex', gap: '12px' },
  confirmButton: { flex: 1, padding: '12px 24px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' },
  cancelButton: { flex: 1, padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' },
};

export default PublishManager;
