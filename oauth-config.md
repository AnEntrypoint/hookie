# GitHub OAuth Setup

This guide explains how to configure GitHub OAuth for the CMS admin panel.

## Steps to Setup GitHub OAuth

### 1. Register OAuth Application
- Go to GitHub Settings → Developer settings → OAuth Apps
- Click "New OAuth App"
- Fill in the form:
  - **Application name**: "My CMS" (or your site name)
  - **Homepage URL**: `https://username.github.io`
  - **Authorization callback URL**: `https://username.github.io/admin` (or your dev URL for local testing)
  - **Application description**: "Dynamic page builder CMS"
- Click "Register application"

### 2. Get Your Credentials
After registration, GitHub shows you:
- **Client ID**: Copy this
- **Client Secret**: Generate and copy this

### 3. Set Environment Variables

Create a `.env.local` file in project root (this file is gitignored):

```
VITE_GITHUB_CLIENT_ID=your-client-id-here
VITE_GITHUB_REDIRECT_URI=https://username.github.io/admin
VITE_GITHUB_OWNER=your-github-username
VITE_GITHUB_REPO=your-repo-name
```

For local development:
```
VITE_GITHUB_CLIENT_ID=your-client-id-here
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/admin
VITE_GITHUB_OWNER=your-github-username
VITE_GITHUB_REPO=your-repo-name
```

### 4. How OAuth Flow Works

1. User clicks "Login" on `/admin`
2. Popup opens to `https://github.com/login/oauth/authorize?client_id=...`
3. User approves access
4. GitHub redirects back to `VITE_GITHUB_REDIRECT_URI?code=...`
5. Code is exchanged for access token via GitHub API
6. Token stored in sessionStorage (cleared on logout)
7. All subsequent API calls include the token

### 5. Permissions

The OAuth scope requested is:
- `repo` - Full control of repos (needed to read/write files and create commits)
- `read:user` - Read user profile

User will see permission prompt during login.

### 6. Token Security Notes

- Token is stored in sessionStorage (cleared when tab closes)
- Never commit `.env.local` - it's in .gitignore
- For production, use a secure OAuth proxy (recommend Netlify/Vercel functions)
- Current setup is for single-user admin access (consider adding backend auth for multi-user)

### 7. Testing

```bash
npm run dev
# Visit http://localhost:5173/admin
# Click Login with GitHub
# Should redirect back and show your user info
```

### Troubleshooting

**"Invalid OAuth code"**
- Check client ID and client secret are correct
- Check redirect URI matches exactly (including trailing slashes)
- Try logging out and back in

**Token expires**
- GitHub tokens last 8 hours
- Token is auto-refreshed on page load if expired
- User will need to re-login if token invalid

**Cannot commit**
- Make sure GitHub user has push access to the repository
- Check the repo is public (needed for GitHub Pages)
