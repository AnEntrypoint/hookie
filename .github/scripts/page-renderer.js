import path from 'path';

export function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

export function styleToString(style) {
  return Object.entries(style).map(([k, v]) => camelToKebab(k) + ': ' + v).join('; ');
}

function camelToKebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

const COMPONENTS = {
  Container: (p, ch) => '<div style="' + styleToString(p.style || {}) + '">' + ch + '</div>',
  Heading: (p) => { const l = Math.max(1, Math.min(6, p.level || 1)); return '<h' + l + ' style="' + styleToString(p.style || {}) + '">' + (p.text || '') + '</h' + l + '>'; },
  Text: (p) => '<p style="' + styleToString(p.style || {}) + '">' + (p.text || '') + '</p>',
  Button: (p) => '<button style="' + styleToString(p.style || {}) + '">' + (p.text || 'Click me') + '</button>',
  Image: (p) => '<img src="' + (p.src || '') + '" alt="' + (p.alt || '') + '" style="' + styleToString(p.style || {}) + '" />',
  Link: (p) => '<a href="' + (p.href || '#') + '" style="' + styleToString(p.style || {}) + '">' + (p.text || 'Link') + '</a>',
  Divider: (p) => '<hr style="' + styleToString(p.style || {}) + '" />',
  Section: (p, ch) => '<section style="' + styleToString(p.style || {}) + '">' + ch + '</section>',
  Grid: (p, ch) => '<div style="display: grid; ' + styleToString(p.style || {}) + '">' + ch + '</div>',
  Card: (p) => {
    const shadows = { small: '0 1px 3px rgba(0,0,0,0.12)', medium: '0 4px 6px rgba(0,0,0,0.1)', large: '0 10px 25px rgba(0,0,0,0.15)' };
    const s = 'background-color:' + (p.backgroundColor || '#fff') + ';border-radius:' + (p.borderRadius || '8px') + ';padding:' + (p.padding || '20px') + ';box-shadow:' + (shadows[p.shadowSize || 'medium']) + ';border:2px solid ' + (p.accentColor || '#007bff') + ';' + styleToString(p.style || {});
    const img = p.imageUrl ? '<img src="' + p.imageUrl + '" alt="' + (p.imageAlt || p.title || '') + '" style="width:100%;height:auto;border-radius:' + (p.borderRadius || '8px') + ';margin-bottom:16px;display:block;object-fit:cover;" />' : '';
    const title = p.title ? '<h3 style="margin:0 0 12px 0;font-size:20px;font-weight:600;color:' + (p.accentColor || '#007bff') + '">' + p.title + '</h3>' : '';
    const desc = p.description ? '<p style="margin:0;font-size:14px;line-height:1.6;color:#555">' + p.description + '</p>' : '';
    return '<div style="' + s + '">' + img + title + desc + '</div>';
  },
};

export function renderComponent(component) {
  const { type, props = {}, children = [] } = component;
  const renderer = COMPONENTS[type];
  if (!renderer) return '';
  return renderer(props, children.map(renderComponent).join(''));
}

export function renderPage(page, baseUrl) {
  const { components = [], title, description } = page;
  const pageTitle = escapeHtml(title || 'Page');
  const pageDesc = escapeHtml(description || 'A page created with Hookie CMS');
  const body = components.map(renderComponent).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${pageDesc}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDesc}">
  <title>${pageTitle}</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333}</style>
</head>
<body>
  ${body}
  <footer style="padding:20px;text-align:center;background:#f8f9fa;border-top:1px solid #e0e0e0;">
    <a href="${baseUrl}/" style="color:#1a73e8;text-decoration:none;font-size:14px;">← Back to Hookie CMS</a>
  </footer>
</body>
</html>`;
}
