# Auth Component

## Purpose
OAuth login UI component for GitHub authentication. Displays login button when unauthenticated, and user info with logout when authenticated.

## Component Type
React functional component

## Dependencies
Requires github.md module for authentication operations.

## State Management
Use React useState for:
- `isAuthenticated` (boolean): Whether user is logged in
- `user` (object|null): User information (login, name, avatar_url)
- `loading` (boolean): Loading state during authentication check

## Lifecycle
On component mount (useEffect):
1. Check for existing auth token using github.getAuthToken()
2. If token exists, fetch user info using github.getUser()
3. Set isAuthenticated to true if user fetch succeeds
4. Set loading to false after check completes
5. Handle errors gracefully (treat as not authenticated)

## Rendering Logic

### Loading State
Display: "Loading..." or a spinner

### Not Authenticated State
Display:
- GitHub logo or icon
- "Sign in with GitHub" button
- On click: Call github.initiateOAuthLogin()

### Authenticated State
Display:
- User avatar (circular image from user.avatar_url)
- User name or login (user.name || user.login)
- "Logout" button
- On logout click:
  - Clear token from localStorage
  - Set isAuthenticated to false
  - Set user to null
  - Optionally reload page

## DOM Structure (Not Authenticated)
```
<div class="auth">
  <button class="auth-login" onClick={handleLogin}>
    <GitHubIcon />
    Sign in with GitHub
  </button>
</div>
```

## DOM Structure (Authenticated)
```
<div class="auth auth-authenticated">
  <img class="auth-avatar" src={user.avatar_url} alt={user.login} />
  <span class="auth-username">{user.name || user.login}</span>
  <button class="auth-logout" onClick={handleLogout}>
    Logout
  </button>
</div>
```

## Event Handlers

### handleLogin
```
() => {
  github.initiateOAuthLogin();
}
```

### handleLogout
```
() => {
  localStorage.removeItem('github_token');
  setIsAuthenticated(false);
  setUser(null);
  window.location.reload(); // Optional: force full app reset
}
```

## Default Export
Export the Auth component as default export.

## Implementation Notes
- Use github module functions exclusively for auth operations
- Handle OAuth redirect flow (token will be in URL after redirect)
- Store minimal state (just authenticated status and user object)
- Avatar should be small (32px or similar)
- Loading state prevents flash of login button
- Logout should clear all auth-related localStorage items
- Consider showing tooltip with user email on hover
- Button styles should match GitHub branding
- Handle network errors during user fetch
- Component should be compact for header placement
