# Live Reload

## Purpose
Monitors a GitHub repository for changes and triggers callbacks when new commits are detected. Enables auto-refresh functionality for the page builder.

## Dependencies
Requires github.md module for GitHub API operations.

## Exports

### `startWatching(owner, repo, callback)`
Starts polling the GitHub repository for changes.

**Parameters:**
- `owner` (string): GitHub repository owner
- `repo` (string): Repository name
- `callback` (function): Function to call when new commits detected
  - Signature: `(newCommits: array) => void`
  - `newCommits` is array of commit objects with: sha, message, author, date

**Returns:** void

**Behavior:**
- Store owner, repo, and callback in module state
- Fetch current latest commit SHA using github.getBranchInfo(owner, repo, 'main')
- Store this SHA as the "last known commit"
- Start polling interval (every 5 seconds)
- On each poll:
  - Fetch current latest commit SHA
  - If SHA differs from last known:
    - Fetch commits between last known and new SHA using github.compareCommits()
    - Call callback with array of new commits
    - Update last known commit to new SHA
- Handle API errors gracefully (log but don't crash)
- Only one watcher can be active at a time (stop previous if exists)

### `stopWatching()`
Stops the polling interval.

**Parameters:** None

**Returns:** void

**Behavior:**
- Clear the polling interval
- Reset internal state (owner, repo, callback, lastCommitSHA)
- Safe to call even if not currently watching

## Internal State
Maintain these variables in module scope:
- `intervalId`: ID of the setInterval timer
- `owner`: Current repository owner
- `repo`: Current repository name
- `callback`: Current callback function
- `lastCommitSHA`: SHA of the last known commit
- `isWatching`: Boolean flag indicating if actively watching

## Polling Logic
```
Every 5 seconds:
1. Call github.getBranchInfo(owner, repo, 'main')
2. Extract latest commit SHA from result
3. Compare with lastCommitSHA
4. If different:
   a. Fetch commits from lastCommitSHA to new SHA
   b. Call callback(newCommits)
   c. Update lastCommitSHA = new SHA
```

## Error Handling
- Catch and log network errors during polling
- Continue polling even if one request fails
- If callback throws error, catch and log it
- Don't propagate errors to calling code

## Performance Considerations
- Use 5-second interval to balance responsiveness and API rate limits
- Only fetch commit details when SHA changes (not every poll)
- Consider exponential backoff if errors occur repeatedly
- Clear interval on stopWatching to prevent memory leaks

## Usage Example
```
startWatching('user', 'repo', (newCommits) => {
  console.log('New commits detected:', newCommits);
  // Trigger page reload or show notification
});

// Later...
stopWatching();
```

## Implementation Notes
- Use setInterval for polling (not setTimeout recursion)
- Always clear interval in stopWatching
- Handle case where repository is brand new (no commits)
- Main branch is hardcoded as 'main' (could be made configurable)
- Callback should be called with empty array if compareCommits fails
