# GitHub Pages Deployment Configuration

## Overview

Hookie CMS is configured to automatically deploy a professional landing page and all generated content pages to GitHub Pages at `https://anentrypoint.github.io/hookie/`.

## Features

### Landing Page (index.html)
- Professional hero section with gradient background
- Platform statistics showing published pages count
- Feature cards highlighting key capabilities
- Responsive navigation bar
- Complete page grid with all published pages
- SEO-optimized meta tags
- Mobile-responsive design

### All Pages
Each generated page includes:
- Proper HTML5 structure
- Meta tags for SEO (description, Open Graph, Twitter Card)
- Responsive viewport configuration
- Theme color specification
- Mobile-friendly styling

### Navigation
- Fixed top navigation bar with gradient background
- Links to home page
- Direct link to featured demo page
- GitHub repository link
- Mobile-responsive design

## Deployment Process

### Automatic Deployment
The deployment is triggered automatically when:
1. Changes are pushed to the `main` branch
2. Content in `content/pages/` directory is modified
3. Components in `src/components/` are updated
4. GitHub Pages workflow file is modified

### Manual Deployment
Trigger deployment manually:
```bash
# Via GitHub CLI
gh workflow run build-pages.yml

# Or via GitHub Actions UI
# 1. Go to Actions tab
# 2. Select "Build Static Pages" workflow
# 3. Click "Run workflow"
```

## Workflow Steps

The GitHub Actions workflow (`build-pages.yml`) performs:

1. **Checkout** - Clone repository with full history
2. **Setup Node.js** - Install Node.js 20.x
3. **Install Dependencies** - Run `npm ci`
4. **Build Admin Interface** - Run `npm run build`
5. **Generate Static Pages** - Execute `generate-static-pages.js`
6. **Configure Pages** - Prepare GitHub Pages environment
7. **Upload Artifact** - Upload `pages-dist` directory
8. **Deploy** - Deploy to GitHub Pages

## Script Details

### generate-static-pages.js

This script generates all static HTML pages:

**Input:**
- Page definitions from `content/pages/*.json`
- Component configurations

**Output:**
- Static HTML files in `pages-dist/`
- Professional landing page (`index.html`)
- Individual page files with SEO metadata
- Responsive design with inline styles

**Key Functions:**
- `renderComponent()` - Converts component JSON to HTML
- `renderPage()` - Wraps content with proper HTML structure and meta tags
- `escapeHtml()` - Sanitizes HTML content to prevent XSS
- Navigation bar generation - Dynamic based on available pages
- Hero section - Professional landing zone
- Statistics section - Shows platform metrics
- Features section - Highlights key capabilities
- Pages grid - Lists all published pages with links

## SEO Optimization

### Meta Tags Included
- `description` - Page description for search engines
- `og:title`, `og:description`, `og:type` - Open Graph tags for social sharing
- `twitter:card`, `twitter:title`, `twitter:description` - Twitter Card tags
- `theme-color` - Browser UI theming
- `robots` - Search engine crawling directives

### Technical SEO
- Proper HTML5 document structure
- Semantic heading hierarchy (h1, h2, h3)
- Alt text support for images
- Mobile-first responsive design
- Fast static HTML delivery
- Descriptive page titles

## Accessing Deployed Content

### Landing Page
```
https://anentrypoint.github.io/hookie/
```

### Featured Demo
```
https://anentrypoint.github.io/hookie/demo.html
```

### All Published Pages
- All pages are automatically listed on the landing page
- Each page is accessible at `/[page-name].html`

## Configuration

### GitHub Pages Settings
1. Navigate to repository Settings
2. Go to "Pages" section
3. Ensure source is set to "GitHub Actions"
4. Custom domain (optional) can be configured

### Page Metadata
To customize page metadata in `content/pages/[name].json`:

```json
{
  "name": "example-page",
  "title": "Example Page Title",
  "description": "SEO description for this page",
  "components": [...]
}
```

### Styling
- Default color scheme: Blue (#1a73e8) with professional gradients
- Typography: System fonts for optimal performance
- Responsive breakpoints: 768px (mobile), 1400px (max-width)
- All styles are inlined for fast static delivery

## Performance

### Metrics
- Static HTML delivery (fast edge caching)
- No database queries (instant page loads)
- Inlined CSS (no additional requests)
- Mobile-optimized
- SEO-friendly structure

### File Sizes
- Landing page: ~17KB
- Content pages: 1-3KB each
- Total: Well under GitHub Pages limits

## Troubleshooting

### Pages Not Deploying
1. Check GitHub Actions tab for workflow status
2. Verify `pages-dist/` directory is generated
3. Ensure workflow has correct permissions
4. Check branch is set to main

### Pages Not Displaying Correctly
1. Verify URL is `https://` (not http://)
2. Check browser cache (hard refresh: Ctrl+F5 or Cmd+Shift+R)
3. Check browser console for errors
4. Verify relative paths in links

### Navigation Not Working
1. Ensure demo.html exists in `content/pages/`
2. Check `generate-static-pages.js` runs without errors
3. Verify index.html is generated in `pages-dist/`

## Future Enhancements

Potential improvements:
- Custom domain mapping
- Analytics integration
- Sitemap generation
- RSS feed support
- Search functionality
- Image optimization
- Code syntax highlighting

## Support

For issues or questions:
- Check GitHub Issues
- Review workflow logs in Actions tab
- Verify content page JSON structure
- Test locally with `npm run build` first
