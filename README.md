# Hookie CMS

A visual page builder that stores content in your GitHub repository. No servers, no databases — just your repo.

## What is Hookie?

Hookie lets you build websites visually and save everything as JSON files in a GitHub repository. You get:

- **Visual drag-and-drop builder** with 18 built-in components
- **GitHub as your CMS** — full version history, no lock-in
- **Zero configuration** — deploy to GitHub Pages or any static host
- **No build step** — open `index.html` and go

## Quick Start

### 1. Create a GitHub Repository

Go to [github.com/new](https://github.com/new) and create a new public or private repo. It can be empty.

### 2. Create a Personal Access Token

Go to [GitHub Settings → Tokens](https://github.com/settings/tokens/new?scopes=repo&description=Hookie+CMS):

- **Classic token**: needs `repo` scope
- **Fine-grained token**: needs `Contents: Read and write` permission for your repo

### 3. Open Hookie

Deploy `index.html` and the `src/` directory to any static host (GitHub Pages, Netlify, Vercel, etc.), or open locally.

Navigate to `app.html#/admin/settings` and complete the 3-step setup:
1. Enter your GitHub token
2. Enter your repo owner and name
3. Verify and save — then click **Initialize Repo** to create starter content

## What Hookie Creates in Your Repo

```
content/
  layout.json          Site-wide header, footer, colors, and typography
  pages/
    home.json          Your homepage (and other pages you create)
  components/          Custom component schemas (if you create any)
```

## Built-in Components

| Component | Category | Description |
|-----------|----------|-------------|
| Hero | Layout | Full-width banner with headline and CTA buttons |
| Navbar | Layout | Navigation bar with logo and links |
| FooterBlock | Layout | Footer with copyright and links |
| Section | Layout | Content section with background options |
| Container | Layout | Centered max-width container |
| Grid | Layout | Responsive multi-column grid |
| Heading | Content | H1–H6 headings |
| Text | Content | Paragraph text with size/color/alignment |
| Image | Content | Lazy-loaded image with effects |
| List | Content | Ordered/unordered list |
| Divider | Layout | Horizontal rule with style options |
| Button | Interactive | Clickable button with 5 variants |
| Link | Interactive | Hyperlink with style options |
| ContactForm | Interactive | Form that POSTs to Formspree or any endpoint |
| Card | Display | Content card with image and text |
| AlertBox | Display | Info/warning/error/success alert |
| Testimonial | Display | Customer quote with avatar and star rating |
| PricingCard | Display | Pricing tier with features checklist |

## Page Templates

When creating a new page, choose from:
- **Blank** — empty canvas
- **Landing Page** — Hero + feature grid + cards
- **About Page** — sections with heading and text
- **Blog Post** — heading + date + content

## Keyboard Shortcuts (in the Builder)

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Delete / Backspace | Delete selected component |
| Ctrl+D | Duplicate selected component |
| Escape | Deselect |
| ? | Show all shortcuts |

## Deploying Your Site

The public-facing site is the same `index.html`. Point visitors to the root URL (not `#/admin`).

For GitHub Pages: enable Pages in your repo settings pointing to the branch where Hookie is deployed.

## Development

```bash
npm install
npm run dev        # Start Vite dev server
npm run build      # Build to dist/
```

Requires Node.js 18+.
