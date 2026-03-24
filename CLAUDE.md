# Hookie CMS - Architecture Notes

## Project Overview
Hookie is a GitHub-backed CMS: pages are stored as JSON in a GitHub repo, edited visually in-browser, and published via the GitHub Contents API.

## Tech Stack
- **React 18** — Admin UI (Builder, Settings, PageManager, etc.)
- **XState v5** — State machines for all complex stateful components
- **WebJSX** — Public-facing page rendering via Web Components
- **Ripple UI** — CSS component framework (Tailwind-based) for admin styling
- **Tailwind CSS v4** — Utility-first CSS for admin layout
- **Vite** — Build tool with React plugin and Tailwind CSS plugin

## File Layout
```
src/
  admin/         Admin UI components (Builder, PageManager, Settings, etc.)
  components/    18 built-in page components (Hero, Card, Grid, etc.)
  lib/           Shared logic (github.js, contentManager.js, componentRegistry.js)
  machines/      XState state machines (adminMachine, builderMachine, etc.)
  public/        Public-facing app (App.js, Router.js, WebJSXRenderer.js)
    webjsx-components/  Web Component definitions for public rendering
  styles/        Tailwind CSS entry point with Ripple UI import
  index.jsx      Entry point - renders App.js
```

## Key Architecture Decisions

### State Management (XState)
- **adminMachine** (`src/machines/adminMachine.js`): States: initializing → welcome | ready. Context holds repoInfo, currentPage, changes[], layoutData, syncStatus, notifications. Ready state has substates: pageManager, pageEditor, componentCreator, library, settings, layout.
- **builderMachine** (`src/machines/builderMachine.js`): States: idle → editing. Context holds pageData, selectedComponentId, history[], historyIndex, paletteVisible. Handles UNDO/REDO with guards.
- **settingsMachine** (`src/machines/settingsMachine.js`): States: checking → tokenStep → repoStep → verifyStep → verifying → connected. Replaces numeric step counter with explicit states.
- **publishMachine** (`src/machines/publishMachine.js`): States: idle → publishing → success | error. SUBMIT guard validates commit message (min 3 chars); failure stays in idle with error set. No confirming intermediate state. Context includes `publishProgress: { current, total } | null` — set by PROGRESS events during publishing, reset to null on SUCCESS/ERROR/RETRY.
- **pageManagerMachine** (`src/machines/pageManagerMachine.js`): States: loading → ready | noRepo | error. Context holds pages[], showForm, submitting.
- **routerMachine** (inline in `src/public/Router.js`): States: loading → ready | notFound | error. Manages page cache and navigation.

All machines use `useMachine()` hook from `@xstate/react` in their respective components.

### Styling (Ripple UI + Tailwind)
- Admin UI uses Ripple UI component classes (btn, alert, card, modal, input, etc.)
- Layout uses Tailwind utility classes (flex, grid, p-*, text-*, etc.)
- Ripple UI imported as pre-built CSS (not as Tailwind plugin — v1 incompatible with Tailwind v4 plugin API)
- CSS entry: `src/styles/tailwind.css` imports Tailwind and Ripple UI CSS
- Tailwind v4 plugin configured in `vite.config.js` via `@tailwindcss/vite`

### Public Rendering (WebJSX)
- Public pages render via WebJSX Web Components instead of React
- Each of 19 component types has a corresponding `<hookie-*>` custom element
- Web Components use Shadow DOM for style isolation
- `src/public/webjsx-components/registry.js` defines all component renderers and styles
- `src/public/WebJSXRenderer.js` builds vnode tree from JSON page data and calls `webjsx.applyDiff()`
- Falls back to React Renderer if WebJSX rendering fails
- Admin Builder still uses React Renderer for edit mode (DnD, selection, etc.)

### Routing
- All routing is hash-based (`#/admin`, `#/pages/home`)
- `src/public/App.js` detects admin routes and renders `AdminApp`, otherwise renders the public site
- `src/admin/Router.js` handles admin route parsing; `src/public/AppRoutes.js` handles public routes
- Public Router uses XState machine for page loading state

### Component System
- **Registry** (`src/lib/componentRegistry.js`): 19 built-in schemas with props, defaults, category, icon
- **React Renderer** (`src/public/Renderer.js`): maps type strings to React components (used in admin edit mode)
- **WebJSX Renderer** (`src/public/WebJSXRenderer.js`): renders page data as Web Components (used in public view)
- **ComponentLoader** (`src/lib/componentLoader.js`): dynamically loaded custom components from GitHub
- To add a new component: add schema to `componentRegistry.js`, add file to `src/components/`, add to `COMPONENT_MAP` in `Renderer.js`, add renderer in `webjsx-components/registry.js`

### Content Storage
- Pages: `content/pages/{slug}.json` — `{ name, title, components[] }`
- Layout: `content/layout.json` — header, footer, colors, typography config
- Custom components: `content/components/{Name}.json` (schema), `src/components/{Name}.js` (implementation)

### GitHub Integration (`src/lib/github.js`)
- Reads use `raw.githubusercontent.com` for public repos (no auth needed for reads)
- Writes use GitHub Contents API (`PUT /repos/{owner}/{repo}/contents/{path}`)
- UTF-8 encoding: `btoa(unescape(encodeURIComponent(content)))` — handles emoji and non-ASCII
- SHA required for updates: fetched via API before write
- `triggerWorkflow(owner, repo, workflowId, ref)` fires `workflow_dispatch` to rebuild GitHub Pages after publish. Returns 204 No Content (not JSON) — do NOT use `apiCall()` for this; uses raw `fetch()`. Errors are swallowed silently (non-fatal).

### Authentication
- Token stored in localStorage under `hookie_token` key (see `settingsStorage.js` for all key names)
- Classic PAT needs `repo` scope; fine-grained needs `Contents: Read and write`
- Token validated against `GET /repos/{owner}/{repo}` before saving

### Builder State
- `Builder.js` uses `builderMachine` for selection, history, and palette state
- `AdminApp.js` uses `adminMachine` for page data, changes list, and routing
- `BuilderCanvas.js` passes `onDelete`/`onDuplicate` down to `Renderer.js`
- `Renderer.js` in edit mode shows floating toolbar (type label, Copy, Delete) above selected component
- `AutoSaveManager` (`src/admin/autoSaveManager.js`) saves to localStorage on every edit, keyed by `autosave_${pageData.name}`. On Builder mount, if saved data exists and differs from the loaded page data (by JSON.stringify), `RecoveryDialog` is shown. Recovery is discarded on explicit dismiss or when saved data matches remote.

### PublishManager
- Uses `publishMachine` with explicit states: idle → publishing → success | error
- Changes accumulate in adminMachine context as `{ path, content, status }` objects
- On publish success: adminMachine receives PUBLISH_SUCCESS, changes cleared
- `PublishModal` wraps `PublishManager` — no nested confirm modal; SUBMIT goes directly to publishing
- During publishing: sends PROGRESS event per file (`{ type: 'PROGRESS', current, total }`); UI shows "Publishing N/M files..." spinner
- After all writes succeed: calls `triggerWorkflow(owner, repo, 'deploy.yml')` before sending SUCCESS


### Theme System (Dark / Light Mode)
- CSS custom properties defined in `src/admin/admin.css` under `:root` (light) and `html[data-theme="dark"]` (dark): `--admin-bg`, `--admin-bg2`, `--admin-bg3`, `--admin-border`, `--admin-text`, `--admin-text2`, `--admin-text3`, `--admin-accent`, `--admin-accent-light`, `--admin-accent-dark`, `--admin-success`.
- `AdminApp.js` initialises `html[data-theme]` on mount: reads `hookie_theme` from localStorage, falls back to `(prefers-color-scheme: dark)` media query.
- `AdminHeader.js` toggle button writes `hookie_theme` to localStorage and flips `html[data-theme]`. Ripple UI uses the same `data-theme` attribute so its components flip automatically.
- All inline styles in `adminHeaderStyles.js` use `var(--admin-*)` — zero hardcoded hex values.
- Landing page (`generate-sections.js`): `html.light` class overrides dark CSS vars with light palette; `@media (prefers-color-scheme: light)` sets light vars by default; toggle button in nav writes `hookie_site_theme` to localStorage; inline script before `</head>` restores class before first paint to prevent flash.

### Admin Preview URL
- On localhost: preview opens `#/pages/{slug}` (SPA hash route, WebJSX renderer).
- On production (non-localhost): preview opens `pages/{slug}.html` — the actual static page generated by CI, identical to what visitors see.
- "Site ↗" link in header goes to the landing page root (`BASE_URL/`) rather than the admin SPA.

### Notifications (Toast)
- `ToastContainer` from `src/admin/Toast.js` is mounted inside `AdminApp` and sets `window.toastManager`
- All success notifications (settings saved, component created) use `useToast()` → `showToast(msg, type)`
- `window.toastManager` is set via a `useEffect` in `ToastContainer`, so it is only available after first render; `showToast` calls before mount are silently dropped

### Settings / Setup
- Uses `settingsMachine` with explicit wizard states: tokenStep → repoStep → verifyStep → connected
- `initRepo()` creates `content/layout.json` and `content/pages/home.json` if missing
- Stored in localStorage; also reads `VITE_GITHUB_OWNER` / `VITE_GITHUB_REPO` env vars
- NEXT guard failures in tokenStep and repoStep produce inline error messages via fallthrough transition (XState v5 array-of-transitions pattern); SET_TOKEN/SET_OWNER/SET_REPO clear the error

## Constraints and Gotchas

### Ripple UI + Tailwind v4
Ripple UI v1 is not compatible with Tailwind v4's plugin API. Ripple UI CSS is imported directly as a pre-built stylesheet rather than as a Tailwind plugin. This means no tree-shaking of unused Ripple UI styles.

### WebJSX + React Coexistence
WebJSX and React use different JSX runtimes. WebJSX components use `webjsx.createElement()` directly (not JSX syntax) to avoid conflicts with React's JSX transform. The Vite config uses `@vitejs/plugin-react` for React JSX only.

### No Build Step Requirement
The project is served directly via Vite dev server or as a built static site. JSX is compiled by Vite, but there is no separate build pipeline for the content.

### ComponentLibrary Preview
`ComponentLibraryDetail.js` renders live previews via `componentLoader.getComponentImplementation()`. Built-in components must be registered via the loader in `AdminApp.loadCustomComponents()` for preview to work.

### File Size Policy
All source files must stay under 200 lines.

### No Test Files
No `.test.js` or `.spec.js` files. Validation done via actual execution against real services.

### liveReload
`src/lib/liveReload.js` polls GitHub for changes and fires a callback when remote changes are detected. Polling is started in `AdminApp.js` when repo is configured.

### Static Page Generation (`bun run generate-pages`)
Four files under `.github/scripts/`:
- `page-renderer.js` — `renderComponent()`, `renderPage()`, `escapeHtml()`, `styleToString()` exported as ES module
- `generate-sections.js` — exports individual HTML section generators: `genStyles`, `genNav`, `genHero`, `genHowItWorks`, `genComponents`, `genTechStack`, `genGetStarted`, `genFooter`
- `generate-landing.js` — exports `generateLanding({ baseUrl, pageList, pageCount, demoExists })` assembling the product marketing website from section generators
- `generate-static-pages.js` — orchestrator: reads `content/pages/*.json`, calls renderer per page, calls landing generator, writes `pages-dist/`
`BASE_URL` env var controls all absolute URLs (fallback: `https://anentrypoint.github.io/hookie`). CI pipeline: (1) copies `screenshot.png` to `public/` before build, (2) after Vite build renames `dist/index.html` → `dist/app.html` so the admin SPA is at `/hookie/app.html`, (3) copies `pages-dist/index.html` → `dist/index.html` so the product website is at the root. Admin URL on deployed site: `BASE_URL/app.html#/admin`.

### gm-cc Lang Plugin (`lang/jsx.js`)
CommonJS plugin for gm-cc that provides JSX/JS syntax checking via `exec:jsx`. The project uses `"type": "module"` in package.json, but lang plugins **must be CommonJS** (`module.exports = {}`). Requires acorn and acorn-jsx at runtime via `require(path.join(cwd, 'node_modules', 'acorn'))` — cwd is the project root passed by the gm-cc hook runner.
