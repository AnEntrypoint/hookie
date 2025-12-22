import React from 'react';

const CommitForm = ({ 
  commitMessage, 
  onChange, 
  onPublish, 
  publishing, 
  disabled,
  changesCount 
}) => {
  const MAX_MESSAGE_LENGTH = 500;
  const MIN_MESSAGE_LENGTH = 10;
  const isMessageValid = commitMessage.length >= MIN_MESSAGE_LENGTH;
  const isFormDisabled = disabled || publishing || !isMessageValid || changesCount === 0;

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter' && !isFormDisabled) {
      onPublish();
    }
  };

  return (
    <div style={{
      padding: '32px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      background: '#ffffff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    }}>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#1e293b'
      }}>
        Commit Message
      </h3>

      <textarea
        value={commitMessage}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your changes..."
        disabled={disabled || publishing}
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '12px',
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 200ms',
          background: disabled || publishing ? '#f8fafc' : '#ffffff',
          color: '#1e293b'
        }}
        onFocus={(e) => {
          if (!disabled && !publishing) {
            e.target.style.borderColor = '#2563eb';
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e2e8f0';
        }}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          {commitMessage.length} / {MAX_MESSAGE_LENGTH} characters
        </div>
        {commitMessage.length > 0 && commitMessage.length < MIN_MESSAGE_LENGTH && (
          <div style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: '500' }}>
            Message must be at least {MIN_MESSAGE_LENGTH} characters
          </div>
        )}
      </div>

      <button
        onClick={onPublish}
        disabled={isFormDisabled}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '1rem',
          fontWeight: '600',
          color: 'white',
          background: isFormDisabled ? '#94a3b8' : '#2563eb',
          border: 'none',
          borderRadius: '8px',
          cursor: isFormDisabled ? 'not-allowed' : 'pointer',
          opacity: isFormDisabled ? 0.5 : 1,
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isFormDisabled ? 'none' : '0 1px 3px rgba(37, 99, 235, 0.3)'
        }}
        onMouseEnter={(e) => {
          if (!isFormDisabled) {
            e.target.style.background = '#1d4ed8';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isFormDisabled) {
            e.target.style.background = '#2563eb';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 1px 3px rgba(37, 99, 235, 0.3)';
          }
        }}
      >
        {publishing ? 'Publishing...' : `Publish ${changesCount} ${changesCount === 1 ? 'Change' : 'Changes'} to GitHub`}
      </button>

      {!isFormDisabled && (
        <div style={{
          marginTop: '12px',
          fontSize: '0.75rem',
          color: '#64748b',
          textAlign: 'center'
        }}>
          Tip: Press Ctrl+Enter to publish quickly
        </div>
      )}
    </div>
  );
};

export default CommitForm;
