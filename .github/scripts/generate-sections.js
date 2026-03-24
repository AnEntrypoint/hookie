const COMPONENTS = [
  ['🔘','Button','Interactive'],['T','Text','Content'],['H','Heading','Content'],
  ['▭','Section','Layout'],['📦','Container','Layout'],['⊞','Grid','Layout'],
  ['🖼','Image','Media'],['─','Divider','Layout'],['🔗','Link','Interactive'],
  ['📋','List','Content'],['🃏','Card','Display'],['⚠️','AlertBox','Display'],
  ['🦸','Hero','Display'],['💬','Testimonial','Display'],['🧭','Navbar','Display'],
  ['🔻','FooterBlock','Display'],['💰','PricingCard','Display'],['📬','ContactForm','Display'],
];

const TECH = [
  ['🟡','Bun','Runtime & bundler'],['🟣','WebJSX','Web components'],
  ['🔵','XState','State machines'],['🎨','Ripple UI','Component library'],
  ['🌊','Tailwind v4','Utility CSS'],['🐙','GitHub API','Content storage'],
];

const STEPS = [
  ['🔑','Connect your repo','Paste a GitHub token with repo scope. Hookie validates it and initialises content/pages/ in your repository — no backend, no OAuth server.'],
  ['🧩','Build visually','Drag-and-drop 18 built-in components onto the canvas. Configure props, styles, and layout with a live preview — zero code required.'],
  ['🚀','Publish & deploy','Commit changes directly to your repo. GitHub Actions builds and deploys to GitHub Pages automatically on every push to main.'],
];

export function genStyles() {
  return `<style>
:root{--bg:#0a0a0f;--bg2:#0d1117;--bg3:#161b22;--bd:#21262d;--acc:#58a6ff;--acc2:#b392f0;--txt:#f0f6fc;--txt2:#8b949e;--grn:#3fb950}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--txt);line-height:1.6}
a{text-decoration:none;color:inherit}
.nav{position:fixed;top:0;left:0;right:0;background:rgba(10,10,15,.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--bd);z-index:100;height:64px;display:flex;align-items:center;padding:0 clamp(16px,4vw,48px)}
.nav-inner{max-width:1200px;width:100%;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:18px;font-weight:800;letter-spacing:-.5px;display:flex;align-items:center;gap:8px}
.logo em{background:linear-gradient(135deg,var(--acc),var(--acc2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-style:normal}
.nav a{padding:7px 14px;border-radius:8px;font-size:14px;font-weight:500;color:var(--txt2)}
.nav a:hover{color:var(--txt)}.nav .cta{background:var(--acc);color:#0d1117;font-weight:700}
.nav .cta:hover{opacity:.9}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px clamp(16px,4vw,48px) 80px;background:radial-gradient(ellipse 90% 55% at 50% 0%,rgba(88,166,255,.09) 0%,transparent 65%)}
.hero h1{font-size:clamp(40px,7vw,80px);font-weight:900;letter-spacing:-3px;line-height:1;margin-bottom:24px}
.grad{background:linear-gradient(135deg,var(--acc),var(--acc2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:clamp(16px,2.2vw,20px);color:var(--txt2);max-width:580px;margin:0 auto 40px;line-height:1.65}
.cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:64px}
.btn-p{padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;background:var(--acc);color:#0d1117;transition:opacity .2s}.btn-p:hover{opacity:.88}
.btn-o{padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;border:1px solid var(--bd);color:var(--txt2);background:transparent;transition:border-color .2s}.btn-o:hover{border-color:var(--acc);color:var(--txt)}
.browser{background:var(--bg3);border:1px solid var(--bd);border-radius:14px;overflow:hidden;width:100%;max-width:960px;box-shadow:0 40px 100px rgba(0,0,0,.6)}
.bbar{background:var(--bg2);padding:12px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--bd)}
.dot{width:12px;height:12px;border-radius:50%}
.burl{flex:1;background:var(--bg3);border-radius:6px;padding:5px 12px;font-size:12px;color:var(--txt2);margin:0 10px;text-align:center}
.browser img{width:100%;display:block}
.sec{padding:100px clamp(16px,4vw,48px)}.sec+.sec{border-top:1px solid var(--bd)}
.sin{max-width:1200px;margin:0 auto}
.slbl{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--acc);margin-bottom:12px}
.stit{font-size:clamp(28px,4vw,46px);font-weight:800;letter-spacing:-1.5px;margin-bottom:14px}
.ssub{font-size:16px;color:var(--txt2);max-width:560px;line-height:1.65;margin-bottom:52px}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.step{background:var(--bg3);border:1px solid var(--bd);border-radius:14px;padding:30px;position:relative;overflow:hidden;transition:border-color .2s}.step:hover{border-color:var(--acc)}
.sn{font-size:80px;font-weight:900;color:rgba(33,38,45,.8);position:absolute;top:-12px;right:14px;line-height:1}
.si{font-size:30px;margin-bottom:18px}.step h3{font-size:17px;font-weight:700;margin-bottom:10px}
.step p{font-size:14px;color:var(--txt2);line-height:1.7}
.cgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:10px}
.cc{background:var(--bg3);border:1px solid var(--bd);border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px;transition:border-color .2s}.cc:hover{border-color:var(--acc)}
.ci{font-size:18px;min-width:22px;text-align:center}.cn h4{font-size:13px;font-weight:600}.cn span{font-size:11px;color:var(--txt2)}
.trow{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px}
.tb{display:flex;align-items:center;gap:8px;background:var(--bg3);border:1px solid var(--bd);border-radius:8px;padding:10px 18px;font-size:13px;font-weight:600}
.tb small{color:var(--txt2);font-weight:400}
.code{background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:28px;font-family:'SF Mono',Cascadia,Consolas,monospace;font-size:13px;line-height:1.9;overflow-x:auto;margin-bottom:36px}
.cm{color:var(--txt2)}.kw{color:var(--acc)}.str{color:var(--grn)}.val{color:var(--acc2)}
.foot{border-top:1px solid var(--bd);padding:36px clamp(16px,4vw,48px);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;font-size:13px;color:var(--txt2)}
.foot a{color:var(--acc)}.foot a:hover{text-decoration:underline}
@keyframes fu{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.hero>*{animation:fu .7s ease both}.hero h1{animation-delay:.05s}.hero p{animation-delay:.15s}.cta-row{animation-delay:.25s}.browser{animation-delay:.35s}
</style>`;
}

export function genNav(adminUrl, githubUrl) {
  return `<nav class="nav"><div class="nav-inner"><div class="logo">⚓ <em>Hookie</em> <span style="color:var(--txt2);font-weight:400;font-size:14px">CMS</span></div><div style="display:flex;gap:4px;align-items:center"><a href="${githubUrl}" target="_blank" rel="noopener">GitHub ↗</a><a href="${adminUrl}" class="cta">Open Admin →</a></div></div></nav>`;
}

export function genHero(adminUrl, githubUrl, screenshotUrl) {
  return `<section class="hero"><h1>Build sites that live<br><span class="grad">in your repo</span></h1><p>Hookie is a visual drag-and-drop page builder that saves everything as JSON in GitHub. No servers. No databases. Just your repository.</p><div class="cta-row"><a href="${adminUrl}" class="btn-p">Open Admin →</a><a href="${githubUrl}" target="_blank" rel="noopener" class="btn-o">View on GitHub</a></div><div class="browser"><div class="bbar"><div class="dot" style="background:#ff5f57"></div><div class="dot" style="background:#febc2e"></div><div class="dot" style="background:#28c840"></div><div class="burl">anentrypoint.github.io/hookie/#/admin</div></div><img src="${screenshotUrl}" alt="Hookie CMS builder interface" loading="lazy"></div></section>`;
}

export function genHowItWorks() {
  const items = STEPS.map(([icon, title, desc], i) => `<div class="step"><span class="sn">${i + 1}</span><div class="si">${icon}</div><h3>${title}</h3><p>${desc}</p></div>`).join('');
  return `<section class="sec"><div class="sin"><p class="slbl">How it works</p><h2 class="stit">From zero to published in minutes</h2><p class="ssub">Three steps, no infrastructure, no lock-in.</p><div class="steps">${items}</div></div></section>`;
}

export function genComponents() {
  const items = COMPONENTS.map(([icon, name, cat]) => `<div class="cc"><span class="ci">${icon}</span><div class="cn"><h4>${name}</h4><span>${cat}</span></div></div>`).join('');
  return `<section class="sec"><div class="sin"><p class="slbl">Component library</p><h2 class="stit">18 built-in components</h2><p class="ssub">Everything you need to build a complete marketing site — drop, configure, done.</p><div class="cgrid">${items}</div></div></section>`;
}

export function genTechStack() {
  const badges = TECH.map(([icon, name, desc]) => `<div class="tb">${icon} ${name} <small>· ${desc}</small></div>`).join('');
  return `<section class="sec"><div class="sin"><p class="slbl">Stack</p><h2 class="stit">Zero-hop architecture</h2><p class="ssub">Engineered for maximum simplicity — single-process, no hop, no database, no vendor lock-in.</p><div class="trow">${badges}</div></div></section>`;
}

export function genGetStarted(adminUrl) {
  const code = `<span class="cm"># 1. Fork the repo on GitHub</span>
<span class="cm"># 2. Enable GitHub Pages → Settings → Pages → Deploy from Actions</span>
<span class="cm"># 3. Open the deployed site and navigate to admin</span>
<span class="kw">open</span> <span class="str">"${adminUrl}"</span>

<span class="cm"># 4. Paste your GitHub Personal Access Token (repo scope)</span>
<span class="cm"># 5. Enter your repo owner/name → Hookie initialises content/</span>
<span class="cm"># 6. Start building — drag components, edit props, click Publish</span>`;
  return `<section class="sec"><div class="sin"><p class="slbl">Get started</p><h2 class="stit">Up and running in 60 seconds</h2><p class="ssub">No npm install. No config files. Fork, enable Pages, open admin.</p><pre class="code">${code}</pre><a href="${adminUrl}" class="btn-p">Open Admin →</a></div></section>`;
}

export function genFooter(adminUrl, githubUrl) {
  return `<footer class="foot"><span>⚓ Hookie CMS · Open Source · No lock-in</span><span><a href="${githubUrl}" target="_blank" rel="noopener">GitHub</a> · <a href="${adminUrl}">Admin</a> · MIT License</span></footer>`;
}
