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
On component mount (useEffect MUST execute this exact sequence):
1. Call github.getAuthToken() to check for existing auth token
2. If token exists (not null):
   a. Call github.getUser() to fetch user info
   b. On success: set isAuthenticated to true AND set user to returned user object
   c. On error: set isAuthenticated to false AND set user to null
3. If token is null:
   a. Set isAuthenticated to false
   b. Set user to null
4. Set loading to false (MUST happen in finally block to always execute)

## Rendering Logic

### Loading State (when loading === true)
MUST display exactly: "Loading..." text in a div with class "auth-loading"

### Not Authenticated State (when loading === false AND isAuthenticated === false)
MUST display:
- Button with class "auth-login" containing text "Sign in with GitHub"
- On button click: MUST call github.initiateOAuthLogin()
- No icon required (text only)

### Authenticated State (when loading === false AND isAuthenticated === true)
MUST display all of these elements:
- img element with class "auth-avatar", src={user.avatar_url}, alt={user.login}, width="32px", height="32px", borderRadius="50%"
- span element with class "auth-username" containing text: user.name if it exists, otherwise user.login
- button with class "auth-logout" containing text "Logout"
- On logout button click MUST execute in this order:
  1. Call github.logout() to clear token from sessionStorage
  2. Set isAuthenticated to false
  3. Set user to null
  4. Call window.location.reload() to force full app reset

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
  github.logout();
  setIsAuthenticated(false);
  setUser(null);
  window.location.reload();
}
```

## Default Export
MUST export the Auth component as default export using: export default Auth;

## Implementation Notes
- MUST use github module functions exclusively for all auth operations (getAuthToken, initiateOAuthLogin, logout, getUser)
- Token storage is ALWAYS in sessionStorage with key 'github_token' (handled by github module)
- MUST render EXACTLY one of: loading state, not authenticated state, or authenticated state (never multiple simultaneously)
- Avatar MUST be exactly 32px width and height with 50% border radius (circular)
- Loading state prevents flash of unauthenticated UI
- MUST call window.location.reload() on logout (not optional)
- User display text MUST use user.name if present, otherwise user.login
- Initial loading state MUST be true
- MUST wrap user fetch in try/catch and treat errors as unauthenticated
