# GitHub API Client

Handles all GitHub OAuth authentication and API operations from the browser.

## OAuth Configuration

GitHub OAuth app details must be set as environment variables:
- `VITE_GITHUB_CLIENT_ID`: Your GitHub OAuth app client ID
- `VITE_GITHUB_REDIRECT_URI`: Redirect URL (e.g., `https://username.github.io/admin`)

## Exports

### `getAuthToken()`
Returns the stored OAuth token from sessionStorage, or null if not authenticated.

### `initiateOAuthLogin()`
Opens GitHub OAuth authorization popup. User approves → redirects back with code → exchanges for access token → stores in sessionStorage.

Returns a Promise that resolves when authentication is complete.

Handles:
- Opening popup to GitHub authorize endpoint
- Listening for redirect with authorization code
- Exchanging code for access token via GitHub API
- Storing token in sessionStorage

### `logout()`
Clears the stored OAuth token from sessionStorage.

### `getRepoStructure(owner, repo)`
Fetches the repository file structure recursively.

Returns: `{ [folderPath]: [files] }` object mapping folder paths to arrays of file objects with `name`, `path`, `type` (file/dir), `sha`.

Used by PageManager to load list of pages and components.

### `readFile(owner, repo, path)`
Reads a single file from repo.

Parameters:
- `owner`: GitHub username
- `repo`: Repository name
- `path`: File path in repo

Returns: `{ content, sha, path }` where content is the file contents (decoded from base64).

Throws error if file not found.

### `writeFile(owner, repo, path, content, message, sha)`
Writes or updates a file in the repository (creates commit).

Parameters:
- `owner`: GitHub username
- `repo`: Repository name
- `path`: File path to write
- `content`: File contents (string)
- `message`: Commit message
- `sha`: Current file SHA (for updates, omit for new files)

Returns: `{ commit, content }` with commit hash and new SHA.

Creates a new commit on the current branch.

### `deleteFile(owner, repo, path, message, sha)`
Deletes a file from the repository.

Parameters:
- `owner`: GitHub username
- `repo`: Repository name
- `path`: File path to delete
- `message`: Commit message
- `sha`: Current file SHA

Returns: `{ commit }` with commit hash.

### `getBranchInfo(owner, repo, branch = 'main')`
Gets information about a branch.

Returns: `{ name, commit: { sha, url }, protected }`

Used to check current branch and latest commit SHA.

### `getCommitHistory(owner, repo, path, limit = 20)`
Fetches recent commits for a specific file or path.

Returns: Array of commits with `sha`, `message`, `author`, `date`, `html_url`.

Used by publish manager to show commit history.

### `compareCommits(owner, repo, base, head)`
Compares two commits to show what changed.

Returns: `{ files: [{ filename, status, additions, deletions, patch }] }`

Used before publishing to show diffs.

### `getUser()`
Fetches current authenticated user info.

Returns: `{ login, name, avatar_url, bio }`

Used in auth UI to show who's logged in.

## Implementation Details

- Use Octokit library for GitHub API calls
- All API requests must include Authorization header with OAuth token
- Handle rate limiting (show error to user if hit)
- Base64 encode/decode for file contents (GitHub API requires this)
- Error handling: throw descriptive errors for network issues, auth failures, file not found, etc.
