import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { publishMachine } from '../machines/publishMachine';
import ChangesList from './ChangesList';
import CommitForm from './CommitForm';
import PublishStatus from './PublishStatus';
import * as github from '../lib/github';

const PublishManager = ({ owner, repo, changes, onRefresh }) => {
  const [state, send] = useMachine(publishMachine);
  const ctx = state.context;

  useEffect(() => {
    if (state.matches('publishing')) doPublish();
  }, [state.value]);

  const doPublish = async () => {
    try {
      for (const change of changes) {
        if (change.status === 'deleted') await github.deleteFile(owner, repo, change.path, ctx.commitMessage, change.sha);
        else await github.writeFile(owner, repo, change.path, change.content, ctx.commitMessage, change.sha);
      }
      const branchInfo = await github.getBranchInfo(owner, repo, 'main');
      send({ type: 'SUCCESS', commit: { sha: branchInfo.commit.sha, message: ctx.commitMessage, timestamp: new Date().toISOString(), url: branchInfo.commit.url } });
      setTimeout(() => { send({ type: 'DISMISS' }); if (onRefresh) onRefresh(); }, 2000);
    } catch (err) {
      let msg = err.message || 'Failed to publish.';
      if (msg.includes('401') || msg.includes('403')) msg = 'Authentication failed.';
      else if (msg.includes('404')) msg = 'Repository not found.';
      else if (msg.includes('429')) msg = 'Rate limit exceeded. Try again later.';
      else if (msg.includes('Network')) msg = 'Network error.';
      send({ type: 'ERROR', error: msg });
    }
  };

  if (!changes || changes.length === 0) {
    return (
      <div className="p-10 text-center">
        <div className="text-5xl mb-4 text-success">✓</div>
        <h2 className="text-lg font-semibold text-success mb-2">No pending changes</h2>
        <p className="text-sm text-content2 max-w-xs mx-auto leading-relaxed">Changes you make in the builder are tracked here. Publish when you're ready.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PublishStatus
        status={state.matches('success') ? 'success' : state.matches('error') ? 'error' : null}
        lastCommit={ctx.lastCommit}
        error={ctx.error}
        onDismiss={() => send({ type: 'DISMISS' })}
        onRetry={() => send({ type: 'RETRY' })}
      />

      <ChangesList changes={changes} expandedDiffs={new Set(ctx.expandedDiffs)} onToggleDiff={path => send({ type: 'TOGGLE_DIFF', path })} />

      <CommitForm
        commitMessage={ctx.commitMessage}
        onChange={msg => send({ type: 'SET_MESSAGE', message: msg })}
        onPublish={() => send({ type: 'SUBMIT' })}
        publishing={state.matches('publishing')}
        disabled={false}
        changesCount={changes.length}
      />
    </div>
  );
};

export default PublishManager;
