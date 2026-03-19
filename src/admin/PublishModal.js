import React from 'react';
import PublishManager from './PublishManager';

export default function PublishModal({ changes, owner, repo, onClose, onPublishSuccess }) {
  return (
    <div className="modal-overlay visible" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal visible max-w-2xl w-full">
        <div className="modal-header flex items-center justify-between p-5 border-b border-border1">
          <h2 className="text-lg font-bold text-content1">Publish Changes</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body flex-1 overflow-y-auto p-0">
          <PublishManager
            changes={changes}
            owner={owner}
            repo={repo}
            onRefresh={onPublishSuccess}
          />
        </div>
      </div>
    </div>
  );
}
