# Hookie CMS - Architecture Notes

## Project Overview
Hookie is a GitHub-backed CMS: pages are stored as JSON in a GitHub repo, edited visually in-browser, and published via the GitHub Contents API.

## File Layout
```
src/
  admin/         Admin UI components (Builder, PageManager, Settings, etc.)
  components/    19 built-in page components (Hero, Card, Grid, etc.)
  lib/           Shared logic (github.js, contentManager.js, componentRegistry.js)
  public/        Public-facing app (App.js, Renderer.js, Router.js)
  main.jsx       Entry point - renders App.js
```

## Key Architecture Decisions

### Routing
- All routing is hash-based (`#/admin`, `#/pages/home`)
- `src/public/App.js` detects admin routes and renders `AdminApp`, otherwise renders the public site
- `src/admin/Router.js` handles admin route parsing; `src/public/AppRoutes.js` handles public routes

### Component System
- **Registry** (`src/lib/componentRegistry.js`): 19 built-in schemas with props, defaults, category, icon
- **Renderer** (`src/public/Renderer.js`): maps type strings to React components via `COMPONENT_MAP`
- **ComponentLoader** (`src/lib/componentLoader.js`): dynamically loaded custom components from GitHub
- To add a new component: add schema to `componentRegistry.js`, add file to `src/components/`, add to `COMPONENT_MAP` in `Renderer.js`

### Content Storage
- Pages: `content/pages/{slug}.json` — `{ name, title, components[] }`
- Layout: `content/layout.json` — header, footer, colors, typography config
- Custom components: `content/components/{Name}.json` (schema), `src/components/{Name}.js` (implementation)

### GitHub Integration (`src/lib/github.js`)
- Reads use `raw.githubusercontent.com` for public repos (no auth needed for reads)
- Writes use GitHub Contents API (`PUT /repos/{owner}/{repo}/contents/{path}`)
- UTF-8 encoding: `btoa(unescape(encodeURIComponent(content)))` — handles emoji and non-ASCII
- SHA required for updates: fetched via API before write

### Authentication
- Token stored in localStorage under `hookie_token` key (see `settingsStorage.js` for all key names)
- Classic PAT needs `repo` scope; fine-grained needs `Contents: Read and write`
- Token validated against `GET /repos/{owner}/{repo}` before saving

### Builder State
- `AdminApp.js` owns page data and changes list
- `Builder.js` owns selection state and undo/redo history
- `BuilderCanvas.js` passes `onDelete`/`onDuplicate` down to `Renderer.js`
- `Renderer.js` in edit mode shows floating toolbar (type label, Copy, Delete) above selected component
- PropsEditor lives in Builder right panel, receives selected component from Builder state

### PublishManager
- Triggered as a modal from AdminHeader Publish button
- Changes accumulate in AdminApp state as `{ path, content, status }` objects
- On publish success: `changes` array cleared, modal closed

### Settings / Setup
- 3-step wizard: Token → Repository → Verify
- `initRepo()` creates `content/layout.json` and `content/pages/home.json` if missing
- Stored in localStorage; also reads `VITE_GITHUB_OWNER` / `VITE_GITHUB_REPO` env vars

## Constraints and Gotchas

### No Build Step Requirement
The project is served directly via Vite dev server or as a built static site. JSX is compiled by Vite, but there is no separate build pipeline for the content.

### ComponentLibrary Preview
`ComponentLibraryDetail.js` renders live previews via `componentLoader.getComponentImplementation()`. Built-in components must be registered via the loader in `AdminApp.loadCustomComponents()` for preview to work.

### File Size Policy
All source files must stay under 200 lines. `ComponentLibrary.js` was refactored (was 798 lines) into `ComponentLibrary.js` + `ComponentLibraryList.js` + `ComponentLibraryDetail.js` + `componentLibraryStyles.js`.

### No Test Files
No `.test.js` or `.spec.js` files. Validation done via actual execution against real services.

### liveReload
`src/lib/liveReload.js` polls GitHub for changes and fires a callback when remote changes are detected. Polling is started in `AdminApp.js` when repo is configured.
