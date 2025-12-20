# PublishManager Component

## Purpose
Manages publishing changes to GitHub. Shows diff of changes, allows commit message input, and handles the commit/push process.

## Component Type
React functional component

## Dependencies
- github.md for git operations

## Props
- `owner` (string): GitHub repository owner
- `repo` (string): Repository name
- `changes` (array): List of changed files
  - Each change: { path, status, diff }

## State Management
Use React useState for:
- `commitMessage` (string): User's commit message
- `publishing` (boolean): Publishing in progress
- `lastCommit` (object|null): Result of last commit
- `error` (string|null): Error message

## Rendering Logic

### No Changes State
Display: "No changes to publish"

### Changes List
Display list of changed files:
- File path
- Status (added, modified, deleted)
- Diff preview (expandable)

### Commit Form
- Textarea for commit message
- Character counter
- "Publish" button (disabled if no message or no changes)
- Show warning if commit message is too short

### Last Commit Display
After successful publish:
- Commit SHA
- Commit message
- Author
- Timestamp
- Link to view commit on GitHub

## DOM Structure
```
<div class="publish-manager">
  <h2>Publish Changes</h2>

  {changes.length === 0 ? (
    <div class="publish-manager-empty">
      <p>No changes to publish</p>
      <p class="hint">Make edits to pages or components to see changes here</p>
    </div>
  ) : (
    <>
      <div class="publish-manager-changes">
        <h3>Changed Files ({changes.length})</h3>

        {changes.map((change, index) => (
          <div key={index} class="change-item">
            <div class="change-header">
              <span class={`change-status change-status-${change.status}`}>
                {change.status}
              </span>
              <span class="change-path">{change.path}</span>
            </div>

            {change.diff && (
              <details class="change-diff">
                <summary>View diff</summary>
                <pre>{change.diff}</pre>
              </details>
            )}
          </div>
        ))}
      </div>

      <div class="publish-manager-commit">
        <h3>Commit Message</h3>

        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Describe your changes..."
          rows={4}
        />

        <div class="commit-message-info">
          <span class="character-count">
            {commitMessage.length} characters
          </span>
          {commitMessage.length < 10 && (
            <span class="warning">
              Commit message should be descriptive (at least 10 characters)
            </span>
          )}
        </div>

        {error && (
          <div class="error-message">{error}</div>
        )}

        <button
          class="publish-button"
          onClick={handlePublish}
          disabled={publishing || !commitMessage.trim() || commitMessage.length < 10}
        >
          {publishing ? 'Publishing...' : 'Publish to GitHub'}
        </button>
      </div>
    </>
  )}

  {lastCommit && (
    <div class="publish-manager-success">
      <h3>Last Published</h3>
      <div class="commit-info">
        <div class="commit-sha">
          <strong>Commit:</strong>
          <a href={`https://github.com/${owner}/${repo}/commit/${lastCommit.sha}`} target="_blank">
            {lastCommit.sha.substring(0, 7)}
          </a>
        </div>
        <div class="commit-message">
          <strong>Message:</strong> {lastCommit.message}
        </div>
        <div class="commit-meta">
          <span>{lastCommit.author}</span>
          <span>{new Date(lastCommit.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )}
</div>
```

## Event Handlers

### handlePublish()
```
async () => {
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
    // For each changed file, commit it
    // In practice, this might batch commits or use a tree API
    const commitResults = [];

    for (const change of changes) {
      if (change.status === 'deleted') {
        // Delete file
        await github.deleteFile(owner, repo, change.path, commitMessage);
      } else {
        // Write file
        await github.writeFile(owner, repo, change.path, change.content, commitMessage);
      }

      commitResults.push({
        path: change.path,
        status: change.status
      });
    }

    // Get latest commit info
    const branchInfo = await github.getBranchInfo(owner, repo, 'main');
    const latestCommit = branchInfo.commit;

    setLastCommit({
      sha: latestCommit.sha,
      message: commitMessage,
      author: latestCommit.commit.author.name,
      timestamp: latestCommit.commit.author.date
    });

    // Clear commit message
    setCommitMessage('');

    // Notify parent (optional)
    // onPublishSuccess?.();
  } catch (err) {
    setError(err.message);
  } finally {
    setPublishing(false);
  }
}
```

## Change Detection
Changes should be tracked by parent component or global state. This component just displays and publishes them.

Possible change structure:
```
{
  path: "/content/pages/home.json",
  status: "modified", // or "added" or "deleted"
  content: "...", // new content for added/modified
  diff: "...", // optional diff string
}
```

## Diff Display
- Use `<pre>` tag for diff output
- Color code additions (green) and deletions (red)
- Support expandable diffs for large changes
- Syntax highlighting optional (using library like react-diff-viewer)

## Commit Message Best Practices
Suggest good commit messages:
- "Update home page layout"
- "Add new About page"
- "Create custom Header component"
- "Fix navigation links"

Show examples or templates on empty state.

## Git Operations
This component handles multiple file commits. Consider:
- Batching commits vs. individual commits per file
- Using GitHub's Git Tree API for atomic multi-file commits
- Handling merge conflicts
- Showing commit history

## Default Export
Export the PublishManager component as default export.

## Implementation Notes
- Validate commit message before allowing publish
- Show progress indicator during publish
- Handle API rate limits gracefully
- Provide link to view commit on GitHub
- Clear form after successful publish
- Show success notification
- Handle errors with helpful messages
- Support markdown in commit messages (optional)
- Preview changes before publishing
- Show file contents diff, not just paths
- Consider auto-save vs. explicit publish
- Implement optimistic UI updates
