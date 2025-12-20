# Quick Start Guide

## System Overview

This is a fully client-side visual page builder CMS that:
- Runs entirely in your browser (no backend server needed)
- Authenticates with GitHub OAuth
- Publishes changes directly to your GitHub repo
- Renders pages dynamically from JSON files
- All hosted on GitHub Pages

## Setup (5 minutes)

### 1. GitHub OAuth Setup
```bash
# Create a GitHub OAuth app at:
# Settings → Developer settings → OAuth Apps → New OAuth App

# Fill in:
# - Application name: "My CMS"
# - Homepage URL: https://your-username.github.io
# - Authorization callback URL: https://your-username.github.io/admin
# - Application description: "Visual page builder"

# Copy your Client ID and generate a Client Secret
```

### 2. Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values:
VITE_GITHUB_CLIENT_ID=your-id-from-oauth-app
VITE_GITHUB_REDIRECT_URI=https://your-username.github.io/admin
VITE_GITHUB_OWNER=your-github-username
VITE_GITHUB_REPO=your-repo-name
```

### 3. Install & Run
```bash
npm install
npm run dev
# Opens http://localhost:5173
```

### 4. Deploy to GitHub Pages
```bash
npm run build
# The hook will detect changes and generate code
# Then push to GitHub and GitHub Actions will deploy
```

## How to Use

### Access the CMS
- **Public site**: `https://your-username.github.io/repo-name`
- **Admin panel**: `https://your-username.github.io/repo-name/admin`

### Editing Workflow
1. Go to `/admin`
2. Click "Login with GitHub"
3. Approve the OAuth request
4. In the admin panel:
   - **Pages**: List and edit existing pages
   - **Components**: Create new component types
   - **Settings**: Configure your site

### Creating a Page
1. Click "Pages" in sidebar
2. Click "New Page"
3. Name your page (e.g., "about")
4. Drag components from the left palette onto the canvas
5. Click each component to edit props and styling
6. Click "Publish" → enter commit message → commit to GitHub
7. Site auto-deploys (takes ~30 seconds)

### Adding Components to a Page
- **Drag from palette**: Text, Button, Image, Grid, Section, Heading, etc.
- **Nested components**: Drag components inside containers (Section, Grid, Container)
- **Edit props**: Click component → edit text, URLs, colors in right panel
- **Style**: Adjust padding, margin, colors, fonts in the Style Editor
- **Undo/Redo**: Press Ctrl+Z / Ctrl+Y

### Creating Custom Components
1. Click "Components" in sidebar
2. Click "New Component"
3. Define:
   - Component name (e.g., "Card")
   - Props (what can be customized)
   - Allowed children (what can go inside)
4. Click "Create Component"
5. Component is now available in the palette
6. Commit saves it to `/content/components/`

## File Structure

```
/
├── src/
│   ├── lib/              # Core libraries
│   ├── admin/            # Admin UI components
│   ├── public/           # Public site components
│   ├── components/       # Reusable page components
│   └── index.md          # Entry point (routes)
├── content/
│   ├── pages/            # Your page JSON files
│   └── components/       # Custom component schemas
├── public/
│   └── index.html        # HTML entry point
└── package.json          # Dependencies
```

## How It Works

### The .md-First System
All code is documented in `.md` files:
- `src/lib/github.md` → generates `src/lib/github.js`
- `src/admin/Builder.md` → generates `src/admin/Builder.js`
- When you edit a `.md`, the hook auto-generates the `.js`
- Never edit `.js` files directly; always edit the `.md`

### Content Storage
Pages are stored as JSON in `/content/pages/`:
```json
{
  "title": "Home",
  "components": [
    {
      "type": "Section",
      "props": {...},
      "style": {...},
      "children": [...]
    }
  ]
}
```

### Publishing
When you click "Publish":
1. Changes are committed to GitHub
2. GitHub Actions builds the site
3. Files deployed to GitHub Pages
4. Site auto-updates in browser

### How Components Work
Each component has:
- **Type**: Name of component (Section, Text, Button, etc.)
- **Props**: Configuration (text content, URLs, colors, etc.)
- **Style**: Inline CSS (padding, margin, colors, fonts, etc.)
- **Children**: Other components inside it

Components are recursively rendered in the renderer.

## Smooth DX Features

✅ **Drag & Drop**: Intuitive visual builder
✅ **Real-time Preview**: See changes instantly
✅ **No Code Required**: Everything in the GUI
✅ **Git-Native**: Full version control
✅ **Undo/Redo**: Work without fear
✅ **Custom Components**: Create new component types
✅ **One-Click Publish**: Commit and deploy with one button
✅ **Auto-Refresh**: Changes from mobile/other devices appear automatically

## Troubleshooting

### "Invalid OAuth code"
- Check Client ID is correct
- Check redirect URI matches exactly
- Try logging out and back in

### Changes not appearing
- Check "Publish" button was clicked
- Check GitHub Actions completed (check repo Actions tab)
- Hard refresh browser (Ctrl+Shift+R)

### Cannot publish
- Make sure you have push access to the repo
- Check GitHub OAuth token is still valid (login again if needed)
- Check you're editing the right repo in environment variables

### Component not showing
- Check component name matches exactly (case-sensitive)
- Make sure component is registered in the registry
- Check props are valid for the component type

## Advanced: Custom Configuration

### Adding Base Components
Edit `src/lib/componentRegistry.md` and add new component types.

### Styling
The system supports:
- Inline CSS properties
- CSS class names (Tailwind, custom CSS, etc.)
- Full styling control via the Style Editor

### Hosting on Subdirectory
If hosting at `username.github.io/site-name/`:
- Update `VITE_GITHUB_REDIRECT_URI=https://username.github.io/site-name/admin`
- Update `vite.config.md` base path if needed

## Support

See `oauth-config.md` for OAuth setup details.

**Ready to build?** Start with the Quick Start, create your first page, and publish!
