import React from 'react';

const PublishStatus = ({ status, lastCommit, error, onDismiss, onRetry }) => {
  if (!status) return null;

  if (status === 'success' && lastCommit) {
    const commitDate = new Date(lastCommit.timestamp);
    const formattedDate = commitDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div style={{
        background: '#ecfdf5',
        border: '2px solid #10b981',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#065f46', marginBottom: '8px' }}>
          Published Successfully
        </h3>
        <p style={{ color: '#047857', marginBottom: '20px' }}>
          Your changes have been pushed to GitHub
        </p>

        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#065f46' }}>Commit:</strong>{' '}
            <a
              href={lastCommit.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb', textDecoration: 'underline', fontFamily: 'monospace' }}
            >
              {lastCommit.sha.substring(0, 7)}
            </a>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#065f46' }}>Message:</strong>{' '}
            <span style={{ color: '#047857' }}>{lastCommit.message}</span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#065f46' }}>Author:</strong>{' '}
            <span style={{ color: '#047857' }}>{lastCommit.author}</span>
          </div>
          <div>
            <strong style={{ color: '#065f46' }}>Time:</strong>{' '}
            <span style={{ color: '#047857' }}>{formattedDate}</span>
          </div>
        </div>

        <button
          onClick={() => window.open(lastCommit.url, '_blank')}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'white',
            background: '#10b981',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '12px'
          }}
        >
          View on GitHub
        </button>
        <button
          onClick={onDismiss}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#065f46',
            background: 'transparent',
            border: '2px solid #10b981',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{
        background: '#fef2f2',
        border: '2px solid #ef4444',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', color: '#dc2626' }}>⚠</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#991b1b', marginBottom: '8px' }}>
          Publishing Failed
        </h3>
        <p style={{ color: '#dc2626', marginBottom: '20px', fontSize: '1rem' }}>
          {error || 'An unexpected error occurred'}
        </p>

        <button
          onClick={onRetry}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'white',
            background: '#ef4444',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '12px'
          }}
        >
          Retry
        </button>
        <button
          onClick={onDismiss}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#991b1b',
            background: 'transparent',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Dismiss
        </button>
      </div>
    );
  }

  return null;
};

export default PublishStatus;
