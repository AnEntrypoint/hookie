# GitHub API Client

Handles all GitHub OAuth authentication and API operations from the browser.

## OAuth Configuration

GitHub OAuth app details must be set as environment variables:
- `VITE_GITHUB_CLIENT_ID`: Your GitHub OAuth app client ID
- `VITE_GITHUB_REDIRECT_URI`: Redirect URL (e.g., `https://username.github.io/admin`)

## Exports

### `getAuthToken()`
Returns the stored OAuth token from sessionStorage. Returns null if not authenticated.

### `initiateOAuthLogin()`
Opens GitHub OAuth authorization popup. The flow proceeds as follows:
1. Opens popup to GitHub authorize endpoint
2. Listens for redirect with authorization code
3. Exchanges code for access token via GitHub API
4. Stores token in sessionStorage

Returns a Promise that resolves when authentication is complete.

### `logout()`
Clears the stored OAuth token from sessionStorage.

### `getRepoStructure(owner, repo)`
Fetches the repository file structure recursively using Octokit.

Parameters:
- `owner`: GitHub username (string, required)
- `repo`: Repository name (string, required)

Returns: `{ [folderPath]: [files] }` object mapping folder paths to arrays of file objects with `name`, `path`, `type` (file/dir), `sha`.

Throws error if repository not found or access denied.

### `readFile(owner, repo, path)`
Reads a single file from repository using Octokit.

Parameters:
- `owner`: GitHub username (string, required)
- `repo`: Repository name (string, required)
- `path`: File path in repo (string, required)

Returns: `{ content, sha, path }` where content is the file contents (decoded from base64).

Throws error if file not found.

### `writeFile(owner, repo, path, content, message, sha)`
Writes or updates a file in the repository using Octokit (creates commit).

Parameters:
- `owner`: GitHub username (string, required)
- `repo`: Repository name (string, required)
- `path`: File path to write (string, required)
- `content`: File contents (string, required)
- `message`: Commit message (string, required)
- `sha`: Current file SHA (string, required for updates, undefined for new files)

Returns: `{ commit, content }` with commit hash and new SHA.

Creates a new commit on the current branch.

### `deleteFile(owner, repo, path, message, sha)`
Deletes a file from the repository using Octokit.

Parameters:
- `owner`: GitHub username (string, required)
- `repo`: Repository name (string, required)
- `path`: File path to delete (string, required)
- `message`: Commit message (string, required)
- `sha`: Current file SHA (string, required)

Returns: `{ commit }` with commit hash.

### `getBranchInfo(owner, repo, branch = 'main')`
Gets information about a branch using Octokit.

Parameters:
- `owner`: GitHub username (string, required)
- `repo`: Repository name (string, required)
- `branch`: Branch name (string, defaults to 'main')

Returns: `{ name, commit: { sha, url }, protected }`

### `getCommitHistory(owner, repo, path, limit = 20)`
Fetches recent commits for a specific file or path using Octokit.

Parameters:
- `owner`: GitHub username (string, required)
- `repo`: Repository name (string, required)
- `path`: File or directory path (string, required)
- `limit`: Maximum number of commits to fetch (number, defaults to 20)

Returns: Array of commits with `sha`, `message`, `author`, `date`, `html_url`.

### `compareCommits(owner, repo, base, head)`
Compares two commits to show what changed using Octokit.

Parameters:
- `owner`: GitHub username (string, required)
- `repo`: Repository name (string, required)
- `base`: Base commit SHA (string, required)
- `head`: Head commit SHA (string, required)

Returns: `{ files: [{ filename, status, additions, deletions, patch }] }`

### `getUser()`
Fetches current authenticated user info using Octokit.

Returns: `{ login, name, avatar_url, bio }`

## Implementation Details

- MUST use Octokit library (@octokit/rest) for all GitHub API calls
- All API requests MUST include Authorization header with OAuth token from sessionStorage
- Token storage location is ALWAYS sessionStorage with key 'github_token'
- Base64 encoding/decoding is required for all file contents (GitHub API requirement)
- Error handling is MANDATORY for all functions:
  - Throw NetworkError with descriptive message for network failures
  - Throw AuthError with descriptive message for authentication failures (401, 403)
  - Throw NotFoundError with descriptive message for missing resources (404)
  - Throw RateLimitError with remaining count when rate limit exceeded (429)
  - Throw ValidationError with details for invalid parameters
- On rate limit (HTTP 429), throw RateLimitError with the X-RateLimit-Remaining value from response headers
