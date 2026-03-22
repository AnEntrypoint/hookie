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
    const total = changes.length;
    try {
      for (let i = 0; i < total; i++) {
        const change = changes[i];
        send({ type: 'PROGRESS', current: i + 1, total });
        if (change.status === 'deleted') await github.deleteFile(owner, repo, change.path, ctx.commitMessage, change.sha);
        else await github.writeFile(owner, repo, change.path, change.content, ctx.commitMessage, change.sha);
      }
      await github.triggerWorkflow(owner, repo, 'deploy.yml');
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

  const progress = ctx.publishProgress;

  return (
    <div className="p-6">
      <PublishStatus
        status={state.matches('success') ? 'success' : state.matches('error') ? 'error' : null}
        lastCommit={ctx.lastCommit}
        error={ctx.error}
        onDismiss={() => send({ type: 'DISMISS' })}
        onRetry={() => send({ type: 'RETRY' })}
      />

      {state.matches('publishing') && progress && (
        <div className="mb-4 p-3 bg-info/10 border border-info/20 rounded-lg flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-info border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span className="text-sm text-info font-medium">Publishing {progress.current}/{progress.total} files...</span>
        </div>
      )}

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
