import { escapeHtml } from './page-renderer.js';

export function generateLanding({ baseUrl, pageList, pageCount, demoExists }) {
  const adminUrl = baseUrl + '/#/admin';
  const nav = `<nav style="position:fixed;top:0;left:0;right:0;background:#0d1117;border-bottom:1px solid #21262d;z-index:100;height:60px;display:flex;align-items:center;padding:0 24px;justify-content:space-between;">
    <span style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.5px;">⚓ Hookie CMS</span>
    <div style="display:flex;gap:8px;">
      ${demoExists ? '<a href="pages/demo.html" style="color:#ccc;text-decoration:none;font-size:14px;padding:6px 14px;border-radius:6px;background:#21262d;">Demo</a>' : ''}
      <a href="${adminUrl}" style="color:#0d1117;text-decoration:none;font-size:14px;padding:6px 14px;border-radius:6px;background:#58a6ff;font-weight:600;">Admin</a>
      <a href="https://github.com/AnEntrypoint/hookie" target="_blank" rel="noopener noreferrer" style="color:#ccc;text-decoration:none;font-size:14px;padding:6px 14px;border-radius:6px;background:#21262d;">GitHub ↗</a>
    </div>
  </nav>`;

  const hero = `<section style="background:linear-gradient(160deg,#0d1117 0%,#161b22 60%,#0d1117 100%);color:#fff;padding:120px 24px 80px;text-align:center;">
    <div style="display:inline-block;background:#21262d;color:#58a6ff;font-size:12px;font-weight:600;padding:4px 14px;border-radius:20px;border:1px solid #30363d;margin-bottom:24px;letter-spacing:0.5px;">OPEN SOURCE · GITHUB-BACKED</div>
    <h1 style="font-size:clamp(32px,5vw,56px);font-weight:800;margin-bottom:16px;letter-spacing:-1.5px;line-height:1.1;">Build sites that live<br><span style="background:linear-gradient(90deg,#58a6ff,#79c0ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">in your repo</span></h1>
    <p style="font-size:18px;color:#8b949e;margin-bottom:40px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.7;">Hookie is a visual page builder that saves everything as JSON in GitHub. No servers, no databases — just your repository.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="${adminUrl}" style="background:#58a6ff;color:#0d1117;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Open Admin →</a>
      <a href="#pages" style="background:transparent;color:#ccc;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;border:1px solid #30363d;">Browse Pages</a>
    </div>
  </section>`;

  const features = [
    ['⚓', 'GitHub as CMS', 'Content lives as JSON in your repo. Full version history, PR reviews, no lock-in.'],
    ['🧩', '19 Built-in Components', 'Hero, Grid, Cards, Testimonials, Pricing, Forms — drag, drop, configure.'],
    ['🎨', 'Visual Builder', 'Drag-and-drop interface with live preview. No code required to build pages.'],
    ['⚡', 'Zero Config Deploy', 'Push to main → GitHub Actions builds and deploys to GitHub Pages automatically.'],
    ['🔒', 'Auth via GitHub Token', 'No OAuth servers. Use a personal access token with repo scope.'],
    ['📱', 'Responsive by Design', 'All components render correctly across mobile, tablet, and desktop.'],
  ].map(([icon, title, desc]) => `<div style="background:#161b22;border:1px solid #21262d;border-radius:10px;padding:24px;">
    <div style="font-size:28px;margin-bottom:12px;">${icon}</div>
    <h3 style="font-size:15px;font-weight:700;color:#e6edf3;margin-bottom:8px;">${title}</h3>
    <p style="font-size:13px;color:#8b949e;line-height:1.6;">${desc}</p>
  </div>`).join('');

  const pagesGrid = pageList.length === 0 ? '<p style="color:#8b949e;text-align:center;padding:40px;">No pages published yet. Open the Admin to create your first page.</p>' :
    pageList.map(([slug, title]) => {
      const isFeatured = slug === 'demo' || slug === 'home';
      return `<a href="pages/${slug}.html" style="display:block;padding:20px;background:#161b22;border:1px solid ${isFeatured ? '#58a6ff' : '#21262d'};border-radius:10px;text-decoration:none;transition:border-color 0.2s;">
        ${isFeatured ? '<span style="font-size:11px;font-weight:600;color:#58a6ff;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:8px;">Featured</span>' : ''}
        <span style="color:#e6edf3;font-size:15px;font-weight:600;display:block;margin-bottom:4px;">${escapeHtml(title)}</span>
        <span style="color:#8b949e;font-size:12px;">/pages/${slug}.html</span>
      </a>`;
    }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Hookie CMS — a visual page builder that stores content in your GitHub repository.">
  <meta property="og:title" content="Hookie CMS">
  <meta property="og:description" content="Build sites that live in your GitHub repo. No servers, no databases.">
  <meta name="robots" content="index, follow">
  <title>Hookie CMS</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0d1117;color:#e6edf3}</style>
</head>
<body>
  ${nav}
  ${hero}
  <section style="padding:80px 24px;max-width:1100px;margin:0 auto;">
    <h2 style="font-size:28px;font-weight:700;text-align:center;margin-bottom:40px;color:#e6edf3;">Everything you need</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">${features}</div>
  </section>
  <section id="pages" style="padding:80px 24px;border-top:1px solid #21262d;">
    <div style="max-width:1100px;margin:0 auto;">
      <h2 style="font-size:28px;font-weight:700;margin-bottom:8px;color:#e6edf3;">Published Pages</h2>
      <p style="color:#8b949e;margin-bottom:32px;font-size:14px;">${pageCount} page${pageCount !== 1 ? 's' : ''} in this site</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">${pagesGrid}</div>
    </div>
  </section>
  <footer style="border-top:1px solid #21262d;padding:40px 24px;text-align:center;color:#8b949e;font-size:13px;">
    <p>Hookie CMS · <a href="https://github.com/AnEntrypoint/hookie" target="_blank" rel="noopener noreferrer" style="color:#58a6ff;text-decoration:none;">GitHub</a> · <a href="${adminUrl}" style="color:#58a6ff;text-decoration:none;">Admin</a></p>
  </footer>
</body>
</html>`;
}
