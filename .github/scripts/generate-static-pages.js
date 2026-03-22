#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderPage, escapeHtml } from './page-renderer.js';
import { generateLanding } from './generate-landing.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.BASE_URL || 'https://anentrypoint.github.io/hookie';
const PAGES_DIR = path.join(__dirname, '../../content/pages');
const OUTPUT_DIR = path.join(__dirname, '../../pages-dist');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const pageFiles = fs.existsSync(PAGES_DIR)
  ? fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'))
  : [];

console.log('Generating', pageFiles.length, 'pages...');

const pageList = [];

for (const file of pageFiles) {
  const slug = path.basename(file, '.json');
  const pageData = JSON.parse(fs.readFileSync(path.join(PAGES_DIR, file), 'utf8'));
  const html = renderPage(pageData, BASE_URL);
  fs.writeFileSync(path.join(OUTPUT_DIR, slug + '.html'), html);
  pageList.push([slug, pageData.title || slug]);
  console.log('✓', slug + '.html');
}

pageList.sort((a, b) => a[0].localeCompare(b[0]));

const indexHtml = generateLanding({
  baseUrl: BASE_URL,
  pageList,
  pageCount: pageList.length,
  demoExists: pageList.some(([s]) => s === 'demo'),
});
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);
console.log('✓ index.html');

fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), `User-agent: *
Allow: /
Disallow:

Sitemap: ${BASE_URL}/sitemap.xml`);
console.log('✓ robots.txt');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
${pageList.map(([slug]) => `  <url><loc>${BASE_URL}/pages/${slug}.html</loc><changefreq>monthly</changefreq><priority>${slug === 'demo' ? '0.9' : '0.8'}</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);
console.log('✓ sitemap.xml');

console.log('\n✅ Done →', OUTPUT_DIR);
