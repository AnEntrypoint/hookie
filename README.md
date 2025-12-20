# Dynamic CMS

A fully dynamic content management system built with React and GitHub, allowing you to create, edit, and manage web content entirely through GitHub repositories.

## Features

- **GitHub-Powered**: All content stored in GitHub repositories
- **Real-Time Publishing**: Changes committed directly to GitHub
- **Component-Based**: Build pages with 10+ reusable components
- **Easy Setup**: Simple configuration for GitHub OAuth
- **Public Access**: Pages accessible without authentication
- **Admin Interface**: Intuitive admin panel for managing content

## Quick Start

### 1. Configuration

Visit `/#/admin/settings` and follow the GitHub OAuth setup guide:

- Create an OAuth App at https://github.com/settings/developers
- Set Homepage URL: `http://localhost:5182`
- Set Authorization callback URL: `http://localhost:5182/?auth=callback`
- Copy the Client ID and paste it in Settings

### 2. Environment Variables

Set your GitHub repository details in `.env`:

```env
VITE_GITHUB_OWNER=your-username
VITE_GITHUB_REPO=your-repo-name
```

### 3. Create Content

Create pages in your repository:

```
content/
  pages/
    home.json
    about.json
  components/
    Button.json
```

### 4. Page Format

```json
{
  "name": "home",
  "title": "Home Page",
  "components": [
    {
      "id": "heading-1",
      "type": "Heading",
      "props": { "level": 1, "text": "Welcome" },
      "style": {},
      "children": []
    }
  ]
}
```

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5182` to see the app.

## Built-in Components

- **Container**: Layout wrapper
- **Heading**: H1-H6 headings
- **Text**: Text content
- **Button**: Clickable buttons
- **Image**: Image display
- **Divider**: Horizontal divider
- **Section**: Content section
- **Grid**: Grid layout
- **Link**: Navigation links
- **List**: List displays

## Admin Features

- **Pages**: Manage page content
- **Components**: Create custom components
- **Settings**: Configure GitHub OAuth

## Architecture

```
src/
  lib/
    github.js          - GitHub API client
    contentManager.js  - Page/content management
    componentRegistry.js - Component registry
  admin/
    AdminApp.js        - Admin dashboard
    Auth.js           - Authentication
  public/
    App.js            - Main app
    Router.js         - Hash-based routing
    Renderer.js       - Dynamic component rendering
  components/
    *.js              - Built-in components
```

## API Integration

The app uses the GitHub REST API via native Fetch:

- `GET /repos/:owner/:repo/contents/:path` - Read files
- `PUT /repos/:owner/:repo/contents/:path` - Create/update files
- `DELETE /repos/:owner/:repo/contents/:path` - Delete files
- `GET /repos/:owner/:repo/git/trees/HEAD` - List repository structure

Authentication uses OAuth tokens stored in `sessionStorage`.

## Deployment

Build for production:

```bash
npm run build
```

Static files will be in `dist/` directory.

Deploy to GitHub Pages or any static hosting service.

## License

MIT
