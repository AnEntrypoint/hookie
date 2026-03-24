import { escapeHtml } from './page-renderer.js';
import { genStyles, genNav, genHero, genHowItWorks, genComponents, genTechStack, genGetStarted, genFooter } from './generate-sections.js';

export function generateLanding({ baseUrl, pageList, pageCount, demoExists }) {
  const adminUrl = baseUrl + '/app.html#/admin';
  const githubUrl = 'https://github.com/AnEntrypoint/hookie';
  const screenshotUrl = baseUrl + '/screenshot.png';

  const pagesGrid = pageList.length === 0
    ? '<p style="color:var(--txt2);text-align:center;padding:40px;">No pages published yet — open Admin to create your first page.</p>'
    : pageList.map(([slug, title]) => {
        const featured = slug === 'demo' || slug === 'home';
        return `<a href="pages/${slug}.html" style="display:block;padding:20px;background:var(--bg3);border:1px solid ${featured ? 'var(--acc)' : 'var(--bd)'};border-radius:10px;text-decoration:none;transition:border-color .2s;">${featured ? '<span style="font-size:11px;font-weight:700;color:var(--acc);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:8px;">Featured</span>' : ''}<span style="color:var(--txt);font-size:15px;font-weight:600;display:block;margin-bottom:4px;">${escapeHtml(title)}</span><span style="color:var(--txt2);font-size:12px;">/pages/${slug}.html</span></a>`;
      }).join('');

  const pagesSection = `<section class="sec" id="pages"><div class="sin"><p class="slbl">Published pages</p><h2 class="stit">Live content</h2><p class="ssub">${pageCount} page${pageCount !== 1 ? 's' : ''} published from this repository.</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">${pagesGrid}</div></div></section>`;

  const body = [
    genNav(adminUrl, githubUrl),
    genHero(adminUrl, githubUrl, screenshotUrl),
    genHowItWorks(),
    genComponents(),
    genTechStack(),
    genGetStarted(adminUrl),
    pageList.length > 0 ? pagesSection : '',
    genFooter(adminUrl, githubUrl),
  ].join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Hookie CMS — a visual drag-and-drop page builder that stores content in your GitHub repository. No servers, no databases.">
<meta property="og:title" content="Hookie CMS — GitHub-backed Visual Page Builder">
<meta property="og:description" content="Build sites that live in your repo. Drag-and-drop components, publish via GitHub Actions.">
<meta property="og:image" content="${screenshotUrl}">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${baseUrl}/">
<title>Hookie CMS — GitHub-backed Visual Page Builder</title>
${genStyles()}
</head>
<body>
${body}
</body>
</html>`;
}
