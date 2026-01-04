#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '../../content/pages');
const COMPONENTS_DIR = path.join(__dirname, '../../src/components');
const OUTPUT_DIR = path.join(__dirname, '../../pages-dist');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const builtInComponents = {
  Container: (props, children) => `<div style="${styleToString(props.style || {})}">${children}</div>`,
  Heading: (props) => {
    const level = Math.max(1, Math.min(6, props.level || 1));
    return `<h${level} style="${styleToString(props.style || {})}">${props.text || ''}</h${level}>`;
  },
  Text: (props) => `<p style="${styleToString(props.style || {})}">${props.text || ''}</p>`,
  Button: (props) => `<button style="${styleToString(props.style || {})}">${props.text || 'Click me'}</button>`,
  Image: (props) => `<img src="${props.src || ''}" alt="${props.alt || ''}" style="${styleToString(props.style || {})}" />`,
  Link: (props) => `<a href="${props.href || '#'}" style="${styleToString(props.style || {})}">${props.text || 'Link'}</a>`,
  Divider: (props) => `<hr style="${styleToString(props.style || {})}" />`,
  Section: (props, children) => `<section style="${styleToString(props.style || {})}">${children}</section>`,
  Grid: (props, children) => `<div style="display: grid; ${styleToString(props.style || {})}">${children}</div>`,
};

function styleToString(style) {
  return Object.entries(style)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');
}

function camelToKebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function renderComponent(component) {
  const { type, props = {}, children = [] } = component;
  const renderer = builtInComponents[type];

  if (!renderer) {
    console.warn(`Unknown component type: ${type}`);
    return '';
  }

  const renderedChildren = children.map(renderComponent).join('');
  return renderer(props, renderedChildren);
}

function renderPage(page, title, description) {
  const { components = [] } = page;
  const body = components.map(renderComponent).join('');
  const pageTitle = title || page.title || 'Page';
  const pageDescription = description || 'A page created with Hookie CMS';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <meta name="theme-color" content="#1a73e8">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(pageDescription)}">
  <title>${escapeHtml(pageTitle)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
  </style>
</head>
<body>
  ${body}
</body>
</html>`;
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

const pageFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'));

console.log(`Found ${pageFiles.length} pages to generate`);

const pageMetadata = new Map();
const pageNameMap = new Map();

pageFiles.forEach(file => {
  const pageName = path.basename(file, '.json');
  const pagePath = path.join(PAGES_DIR, file);
  const pageData = JSON.parse(fs.readFileSync(pagePath, 'utf8'));

  pageNameMap.set(pageName, pageData.title || pageName);
  pageMetadata.set(pageName, {
    title: pageData.title || pageName,
    description: pageData.description || 'A page created with Hookie CMS',
  });

  const html = renderPage(pageData, pageData.title, pageData.description);
  const outputPath = path.join(OUTPUT_DIR, `${pageName}.html`);

  fs.writeFileSync(outputPath, html);
  console.log(`✓ Generated ${pageName}.html`);
});

const pageList = Array.from(pageNameMap.entries())
  .sort((a, b) => a[0].localeCompare(b[0]));

const demoExists = pageNameMap.has('demo');
const homeExists = pageNameMap.has('home');

const navBarHtml = `<nav style="position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%); padding: 0; margin: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 1000;">
  <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 64px;">
    <div style="font-size: 24px; font-weight: 700; color: white; letter-spacing: -0.5px;">Hookie</div>
    <div style="display: flex; gap: 30px; align-items: center;">
      <a href="./index.html" style="color: white; text-decoration: none; font-weight: 500; font-size: 14px; padding: 8px 16px; border-radius: 4px; transition: background 0.2s;">Home</a>
      ${demoExists ? '<a href="./demo.html" style="color: white; text-decoration: none; font-weight: 500; font-size: 14px; padding: 8px 16px; border-radius: 4px; background: rgba(255,255,255,0.2); transition: background 0.2s;">Featured Demo</a>' : ''}
      <a href="https://github.com/AnEntrypoint/hookie" target="_blank" rel="noopener noreferrer" style="color: white; text-decoration: none; font-weight: 500; font-size: 14px; padding: 8px 16px; border-radius: 4px; transition: background 0.2s;">GitHub</a>
    </div>
  </div>
</nav>`;

const heroHtml = `<section style="background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%); color: white; padding: 120px 20px 80px; text-align: center; margin-top: 64px;">
  <h1 style="font-size: 48px; font-weight: 700; margin-bottom: 20px; letter-spacing: -1px;">Hookie CMS</h1>
  <p style="font-size: 20px; font-weight: 300; margin-bottom: 30px; opacity: 0.95; max-width: 600px; margin-left: auto; margin-right: auto;">A powerful, flexible headless CMS built for developers. Create, manage, and deploy content with ease.</p>
  <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
    <a href="${demoExists ? './demo.html' : '#pages'}" style="background: white; color: #1a73e8; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; display: inline-block;">View Demo</a>
    <a href="https://github.com/AnEntrypoint/hookie" target="_blank" rel="noopener noreferrer" style="background: rgba(255,255,255,0.2); color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; border: 2px solid rgba(255,255,255,0.3); transition: transform 0.2s, background 0.2s; display: inline-block;">GitHub Repository</a>
  </div>
</section>`;

const statsHtml = `<section style="background: #f8f9fa; padding: 60px 20px; text-align: center;">
  <div style="max-width: 1400px; margin: 0 auto;">
    <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 50px; color: #1a73e8;">Platform Statistics</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px;">
      <div style="padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 40px; font-weight: 700; color: #1a73e8; margin-bottom: 10px;">${pageFiles.length}</div>
        <div style="font-size: 16px; color: #666; font-weight: 500;">Published Pages</div>
      </div>
      <div style="padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 40px; font-weight: 700; color: #1a73e8; margin-bottom: 10px;">React 18</div>
        <div style="font-size: 16px; color: #666; font-weight: 500;">Component Framework</div>
      </div>
      <div style="padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 40px; font-weight: 700; color: #1a73e8; margin-bottom: 10px;">GitHub</div>
        <div style="font-size: 16px; color: #666; font-weight: 500;">Powered by</div>
      </div>
    </div>
  </div>
</section>`;

const pagesGridHtml = `<section id="pages" style="padding: 60px 20px; background: white;">
  <div style="max-width: 1400px; margin: 0 auto;">
    <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 50px; color: #1a73e8;">Explore All Pages</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
      ${pageList
        .map(([pageName, pageTitle]) => {
          const isDemo = pageName === 'demo';
          const badgeHtml = isDemo ? '<span style="display: inline-block; background: #1a73e8; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">Featured</span>' : '';
          return `<a href="./${pageName}.html" style="display: block; padding: 24px; background: white; border: 2px solid #e0e0e0; border-radius: 8px; text-decoration: none; transition: all 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            ${badgeHtml}
            <h3 style="color: #1a73e8; font-size: 18px; font-weight: 600; margin-bottom: 8px; word-break: break-word;">${escapeHtml(pageTitle)}</h3>
            <p style="color: #666; font-size: 14px;">Page: ${escapeHtml(pageName)}</p>
          </a>`;
        })
        .join('')}
    </div>
  </div>
</section>`;

const featuresHtml = `<section style="background: #f8f9fa; padding: 60px 20px;">
  <div style="max-width: 1400px; margin: 0 auto;">
    <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 50px; text-align: center; color: #1a73e8;">Key Features</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
      <div style="padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 15px;">⚡</div>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a73e8; margin-bottom: 10px;">Fast & Lightweight</h3>
        <p style="color: #666; line-height: 1.6;">Static HTML generation for lightning-fast page loads and excellent performance.</p>
      </div>
      <div style="padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 15px;">🔧</div>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a73e8; margin-bottom: 10px;">Flexible Components</h3>
        <p style="color: #666; line-height: 1.6;">Drag-and-drop component builder with extensive customization options.</p>
      </div>
      <div style="padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 15px;">🔌</div>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a73e8; margin-bottom: 10px;">GitHub Integration</h3>
        <p style="color: #666; line-height: 1.6;">Manage all your content through GitHub - no external database needed.</p>
      </div>
      <div style="padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 15px;">📱</div>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a73e8; margin-bottom: 10px;">Responsive Design</h3>
        <p style="color: #666; line-height: 1.6;">All pages automatically adapt to mobile, tablet, and desktop screens.</p>
      </div>
      <div style="padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 15px;">🔍</div>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a73e8; margin-bottom: 10px;">SEO Optimized</h3>
        <p style="color: #666; line-height: 1.6;">Built-in meta tags and structured data for excellent search engine visibility.</p>
      </div>
      <div style="padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="font-size: 32px; margin-bottom: 15px;">📦</div>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a73e8; margin-bottom: 10px;">Deploy Anywhere</h3>
        <p style="color: #666; line-height: 1.6;">GitHub Pages, Vercel, Netlify, or any static hosting platform.</p>
      </div>
    </div>
  </div>
</section>`;

const footerHtml = `<footer style="background: #1a1a1a; color: #fff; padding: 40px 20px; text-align: center;">
  <div style="max-width: 1400px; margin: 0 auto;">
    <p style="margin-bottom: 10px; font-size: 14px;">Hookie CMS - A Modern Headless Content Management System</p>
    <p style="margin-bottom: 20px; font-size: 14px; opacity: 0.7;">Built with React, Powered by GitHub</p>
    <p style="font-size: 12px; opacity: 0.6;">
      <a href="https://github.com/AnEntrypoint/hookie" target="_blank" rel="noopener noreferrer" style="color: #1a73e8; text-decoration: none;">GitHub Repository</a>
    </p>
  </div>
</footer>`;

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Hookie CMS - A powerful, flexible headless content management system built for developers. Create, manage, and deploy content with ease using React and GitHub.">
  <meta name="keywords" content="CMS, headless CMS, content management, GitHub, React, static site generator">
  <meta name="theme-color" content="#1a73e8">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Hookie CMS - Modern Headless Content Management">
  <meta property="og:description" content="A powerful, flexible headless CMS built for developers. Create, manage, and deploy content with ease.">
  <meta property="og:url" content="https://anentrypoint.github.io/hookie/">
  <meta property="og:site_name" content="Hookie CMS">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Hookie CMS - Modern Headless Content Management">
  <meta name="twitter:description" content="A powerful, flexible headless CMS built for developers. Create, manage, and deploy content with ease.">
  <title>Hookie CMS - Modern Headless Content Management</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html {
      scroll-behavior: smooth;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    a:hover {
      opacity: 0.8;
    }
    @media (max-width: 768px) {
      nav div:nth-child(2) { gap: 15px !important; }
      h1 { font-size: 32px !important; }
      h2 { font-size: 24px !important; }
      section { padding: 40px 15px !important; }
    }
  </style>
</head>
<body>
  ${navBarHtml}
  ${heroHtml}
  ${statsHtml}
  ${featuresHtml}
  ${pagesGridHtml}
  ${footerHtml}
</body>
</html>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);
console.log(`✓ Generated index.html`);

const robotsTxt = `User-agent: *
Allow: /
Disallow:

Sitemap: https://anentrypoint.github.io/hookie/sitemap.xml`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), robotsTxt);
console.log(`✓ Generated robots.txt`);

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://anentrypoint.github.io/hookie/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${pageList
  .map(([pageName]) => {
    return `  <url>
    <loc>https://anentrypoint.github.io/hookie/${pageName}.html</loc>
    <changefreq>monthly</changefreq>
    <priority>${pageName === 'demo' ? '0.9' : '0.8'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapXml);
console.log(`✓ Generated sitemap.xml`);

console.log(`\n✅ All pages generated in ${OUTPUT_DIR}`);
