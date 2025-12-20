# Live Reload

## Purpose
Monitors a GitHub repository for changes and triggers callbacks when new commits are detected. Enables auto-refresh functionality for the page builder.

## Dependencies
Requires github.md module for GitHub API operations.

## Exports

### `startWatching(owner, repo, callback)`
Starts polling the GitHub repository for changes.

**Parameters:**
- `owner` (string, required): GitHub repository owner
- `repo` (string, required): Repository name
- `callback` (function, required): Function to call when new commits detected
  - Signature: `(newCommits: array) => void`
  - `newCommits` is array of commit objects with: sha, message, author, date

**Returns:** void

**Behavior:**
- Stores owner, repo, and callback in module state variables
- Fetches current latest commit SHA using github.getBranchInfo(owner, repo, 'main')
- Stores this SHA as the "lastCommitSHA" variable
- Starts polling interval using setInterval with EXACTLY 5000ms interval
- On each poll iteration:
  - Fetches current latest commit SHA using github.getBranchInfo(owner, repo, 'main')
  - Compares SHA with lastCommitSHA using strict equality (===)
  - If SHA differs from lastCommitSHA:
    - Fetches commits between lastCommitSHA and new SHA using github.compareCommits(owner, repo, lastCommitSHA, newSHA)
    - Calls callback with array of new commits
    - Updates lastCommitSHA to new SHA
  - If SHA matches lastCommitSHA:
    - Does nothing, continues to next poll iteration
- Catches and logs API errors using console.error() but continues polling
- Stops and clears any previous watcher if one exists before starting new one

### `stopWatching()`
Stops the polling interval.

**Parameters:** None

**Returns:** void

**Behavior:**
- Calls clearInterval() with the stored intervalId
- Resets internal state variables to initial values:
  - intervalId = null
  - owner = null
  - repo = null
  - callback = null
  - lastCommitSHA = null
  - isWatching = false
- Is safe to call even if not currently watching (checks intervalId before clearing)

## Internal State
MUST maintain these exact variables in module scope with these exact initial values:
- `intervalId`: null (ID of the setInterval timer)
- `owner`: null (Current repository owner)
- `repo`: null (Current repository name)
- `callback`: null (Current callback function)
- `lastCommitSHA`: null (SHA of the last known commit)
- `isWatching`: false (Boolean flag indicating if actively watching)

## Polling Logic
Polling MUST follow this exact sequence every 5000ms:
1. Call github.getBranchInfo(owner, repo, 'main')
2. Extract latest commit SHA from result.commit.sha
3. Compare with lastCommitSHA using === operator
4. If SHA !== lastCommitSHA:
   a. Call github.compareCommits(owner, repo, lastCommitSHA, newSHA)
   b. Extract commits array from comparison result
   c. Call callback(commits)
   d. Set lastCommitSHA = newSHA
5. If SHA === lastCommitSHA:
   a. Do nothing, wait for next interval

## Error Handling
MUST implement these exact error behaviors:
- Wrap all github API calls in try/catch blocks
- On caught error: log to console using console.error('Live reload error:', error)
- On caught error: continue polling (do not stop interval)
- If callback function throws error: catch it, log it with console.error(), continue polling
- Do not propagate errors to calling code
- On three consecutive errors: log warning but continue polling
- Never stop polling due to errors (only stopWatching() stops polling)

## Polling Interval
- Interval MUST be exactly 5000 milliseconds (5 seconds)
- MUST use setInterval (not setTimeout recursion)
- Interval starts immediately when startWatching() is called
- First poll happens after 5000ms (not immediately)

## Branch Configuration
- Branch name is ALWAYS 'main' (hardcoded, not configurable)
- MUST use 'main' in all github.getBranchInfo() calls

## Initial State Behavior
When startWatching() is called:
1. If intervalId is not null, call clearInterval(intervalId) first
2. Fetch initial commit SHA synchronously before starting interval
3. Set isWatching = true before starting interval
4. Store intervalId from setInterval() return value
5. Only then begin polling

## Callback Behavior
- Callback MUST be called with array of commits
- Callback MUST be called EVERY time new commits are detected
- Callback receives empty array [] if compareCommits fails or returns no commits
- Callback is NEVER called if no new commits (SHA unchanged)

## Implementation Notes
- MUST use setInterval for polling (not recursive setTimeout)
- MUST clear interval using clearInterval in stopWatching()
- Branch name 'main' is hardcoded (not a parameter)
- Interval starts after initial commit SHA is fetched
- MUST handle case where repository is brand new with no commits (treat as no changes)
- MUST maintain reference to intervalId to enable proper cleanup
