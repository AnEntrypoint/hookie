import * as webjsx from 'webjsx';

const TAG_PREFIX = 'hookie';

const componentStyles = {
  hero: `
    :host { display: block; }
    .hero { padding: 80px 24px; text-align: center; min-height: var(--min-height, 480px); display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .hero.bg-blue { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); }
    .hero.bg-purple { background: linear-gradient(135deg, #6d28d9 0%, #a855f7 100%); }
    .hero.bg-green { background: linear-gradient(135deg, #065f46 0%, #10b981 100%); }
    .hero.bg-dark { background: #1e293b; }
    .hero.bg-white { background: #ffffff; }
    .hero.bg-light { background: #f8fafc; }
    .hero.bg-sunset { background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%); }
    .hero.bg-midnight { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); }
    h1 { font-size: 3rem; font-weight: 800; margin: 0 0 16px; letter-spacing: -1px; }
    p { font-size: 1.25rem; margin: 0 0 32px; opacity: 0.9; max-width: 600px; }
    .cta-group { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    .cta { display: inline-flex; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 1rem; }
    .cta-primary { background: rgba(255,255,255,0.2); color: inherit; border: 2px solid rgba(255,255,255,0.4); }
    .cta-secondary { background: transparent; color: inherit; border: 2px solid rgba(255,255,255,0.3); }
  `,
  card: `
    :host { display: block; }
    .card { border-radius: var(--radius, 0px); padding: var(--padding, 24px); overflow: hidden; }
    .card img { width: 100%; height: 200px; object-fit: cover; margin-bottom: 16px; }
    h3 { margin: 0 0 8px; font-size: 1rem; font-weight: 700; font-family: monospace; text-transform: lowercase; }
    p { margin: 0; line-height: 1.6; font-size: 0.875rem; }
  `,
  section: `
    :host { display: block; }
    .section { padding: var(--padding, 48px 24px); }
    .section.bg-white { background: #ffffff; }
    .section.bg-light { background: #f8fafc; }
    .section.bg-subtle { background: #f1f5f9; }
    h2 { margin: 0 0 8px; font-size: 1.75rem; font-weight: 700; }
    .subtitle { margin: 0 0 24px; font-size: 1rem; }
    .content { max-width: 1200px; margin: 0 auto; }
    slot { display: block; }
  `,
  text: `:host { display: block; } p { margin: 0; line-height: 1.7; }`,
  heading: `:host { display: block; } h1,h2,h3,h4,h5,h6 { margin: 0; }`,
  button: `:host { display: inline-block; } button { padding: 10px 20px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; font-size: 0.9375rem; } .primary { background: #2563eb; color: #fff; } .secondary { background: #f1f5f9; color: #1e293b; } .outline { background: transparent; border: 2px solid #2563eb; color: #2563eb; } .ghost { background: transparent; color: #2563eb; } .danger { background: #ef4444; color: #fff; }`,
  image: `:host { display: block; } img { max-width: 100%; height: auto; display: block; }`,
  grid: `:host { display: block; } .grid { display: grid; gap: var(--gap, 24px); } slot { display: contents; }`,
  container: `:host { display: block; } .container { max-width: var(--max-width, 1200px); margin: 0 auto; } slot { display: contents; }`,
  divider: `:host { display: block; } hr { border: none; margin: var(--margin, 24px 0); }`,
  link: `:host { display: inline; } a { text-decoration: none; font-weight: 500; } a.underline { text-decoration: underline; }`,
  list: `:host { display: block; } ul, ol { margin: 0; padding-left: 24px; } li { margin-bottom: 8px; line-height: 1.6; }`,
  alertbox: `:host { display: block; } .alert { padding: 16px; border-radius: 8px; } .info { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; } .warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; } .error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; } .success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; } h4 { margin: 0 0 4px; font-weight: 700; } p { margin: 0; }`,
  testimonial: `:host { display: block; } .testimonial { padding: 24px; border-radius: 12px; } blockquote { margin: 0 0 16px; font-size: 1.1rem; line-height: 1.6; font-style: italic; } .author { font-weight: 700; } .role { color: #64748b; font-size: 0.875rem; } .stars { color: #f59e0b; letter-spacing: 2px; }`,
  navbar: `:host { display: block; } nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; } .logo { font-weight: 800; font-size: 1.125rem; } .links { display: flex; gap: 24px; } a { text-decoration: none; font-weight: 500; font-size: 0.9375rem; }`,
  footerblock: `:host { display: block; } footer { padding: 32px 24px; text-align: center; } .links { display: flex; gap: 16px; justify-content: center; margin-bottom: 12px; } a { text-decoration: none; } .copyright { font-size: 0.875rem; opacity: 0.7; }`,
  pricingcard: `:host { display: block; } .pricing { padding: 32px; border-radius: 12px; text-align: center; } .plan { font-weight: 700; font-size: 1.25rem; margin: 0 0 8px; } .price { font-size: 2.5rem; font-weight: 800; margin: 0; } .period { font-size: 1rem; opacity: 0.6; } ul { list-style: none; padding: 0; margin: 24px 0; } li { padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.06); } .cta { display: block; padding: 12px; border-radius: 8px; font-weight: 700; text-decoration: none; margin-top: 16px; }`,
  contactform: `:host { display: block; } form { display: flex; flex-direction: column; gap: 16px; max-width: 500px; } label { font-weight: 600; font-size: 0.875rem; display: flex; flex-direction: column; gap: 6px; } input, textarea { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 1rem; font-family: inherit; } textarea { min-height: 120px; resize: vertical; } button { padding: 12px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem; }`,
};

const SLOT_TYPES = new Set(['section','container','grid']);

function createBaseClass(type) {
  return class extends HTMLElement {
    static get observedAttributes() { return ['props']; }
    constructor() { super(); this.attachShadow({ mode: 'open' }); this._props = {}; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { this.render(); }
    set props(val) { this._props = typeof val === 'string' ? JSON.parse(val) : val; this.render(); }
    get props() { return this._props; }
    render() {
      const css = componentStyles[type] || ':host { display: block; }';
      const vdom = renderers[type]?.(this._props) || webjsx.createElement('div', null, `Unknown: ${type}`);
      const slotEl = SLOT_TYPES.has(type) ? webjsx.createElement('slot', null) : null;
      webjsx.applyDiff(this.shadowRoot, webjsx.createElement('div', null,
        webjsx.createElement('style', null, css),
        vdom,
        slotEl
      ));
    }
  };
}

const sizeMap = { sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' };
const padMap = { sm: '24px 16px', md: '48px 24px', lg: '64px 32px', xl: '80px 40px', '2xl': '120px 48px', none: '0' };
const gapMap = { sm: '12px', md: '24px', lg: '32px', xl: '48px' };
const maxWidthMap = { sm: '640px', md: '768px', lg: '1024px', xl: '1200px', '2xl': '1400px' };

const renderers = {
  hero: (p) => webjsx.createElement('div', { class: `hero bg-${p.background || 'blue'}`, style: `color: ${p.textColor || '#fff'}; text-align: ${p.textAlign || 'center'}; min-height: ${p.minHeight || '480px'}; ${p.backgroundImage ? `background-image: url(${p.backgroundImage}); background-size: cover;` : ''}` },
    webjsx.createElement('h1', null, p.headline || ''),
    webjsx.createElement('p', null, p.subheadline || ''),
    webjsx.createElement('div', { class: 'cta-group' },
      p.ctaText ? webjsx.createElement('a', { href: p.ctaHref || '#', class: 'cta cta-primary' }, p.ctaText) : null,
      p.secondaryCtaText ? webjsx.createElement('a', { href: p.secondaryCtaHref || '#', class: 'cta cta-secondary' }, p.secondaryCtaText) : null
    )
  ),
  card: (p) => webjsx.createElement('div', { class: 'card', style: `background: ${p.backgroundColor || '#fff'}; color: ${p.accentColor || '#2563eb'};` },
    p.imageUrl ? webjsx.createElement('img', { src: p.imageUrl, alt: p.imageAlt || '' }) : null,
    webjsx.createElement('h3', { style: `color: ${p.accentColor || '#2563eb'}` }, p.title || ''),
    webjsx.createElement('p', { style: `color: ${p.backgroundColor === '#111111' ? '#888888' : '#64748b'}` }, p.description || '')
  ),
  section: (p) => {
    const bg = p.background || 'transparent';
    return webjsx.createElement('div', { class: `section ${bg !== 'transparent' ? 'bg-' + bg : ''}`, style: `padding: ${padMap[p.padding] || padMap.md}` },
      p.title ? webjsx.createElement('h2', null, p.title) : null,
      p.subtitle ? webjsx.createElement('p', { class: 'subtitle' }, p.subtitle) : null
    );
  },
  text: (p) => webjsx.createElement('p', { style: `font-size: ${sizeMap[p.size] || sizeMap.base}; color: ${p.color || '#1e293b'}; font-weight: ${p.weight || 'normal'}; text-align: ${p.align || 'left'}` }, p.content || ''),
  heading: (p) => webjsx.createElement(`h${p.level || 2}`, { style: `color: ${p.color || '#1e293b'}; text-align: ${p.align || 'left'}; font-weight: ${p.weight || 'bold'}` }, p.text || ''),
  button: (p) => webjsx.createElement('button', { class: p.variant || 'primary', disabled: p.disabled, style: p.fullWidth ? 'width:100%' : '' }, p.label || 'Click me'),
  image: (p) => webjsx.createElement('img', { src: p.src || '', alt: p.alt || '', style: `width: ${p.width || '100%'}; height: ${p.height || 'auto'}; object-fit: ${p.objectFit || 'cover'}; border-radius: 8px;`, loading: p.lazy !== false ? 'lazy' : 'eager' }),
  grid: (p) => webjsx.createElement('div', { class: 'grid', style: `grid-template-columns: repeat(${p.autoFit ? `auto-fit, minmax(${p.minItemWidth || '280px'}, 1fr)` : `${p.columns || 3}, 1fr`}); gap: ${gapMap[p.gap] || gapMap.md}` }),
  container: (p) => webjsx.createElement('div', { class: 'container', style: `max-width: ${maxWidthMap[p.maxWidth] || maxWidthMap.xl}; padding: ${padMap[p.padding] || '0 24px'}; display: flex; flex-wrap: wrap; gap: 1rem;` }),
  divider: (p) => webjsx.createElement('hr', { style: `border-top: ${p.thickness === 'thin' ? '1px' : p.thickness === 'thick' ? '3px' : p.thickness === 'xl' ? '5px' : '2px'} ${p.variant || 'solid'} ${p.color === 'primary' ? '#2563eb' : p.color === 'dark' ? '#1e293b' : '#e2e8f0'}; margin: ${padMap[p.margin] || '24px 0'}` }),
  link: (p) => webjsx.createElement('a', { href: p.href || '#', target: p.newTab ? '_blank' : '_self', class: p.variant || '' }, p.text || ''),
  list: (p) => {
    const items = (p.items || []).map(item => webjsx.createElement('li', null, typeof item === 'string' ? item : item.toString()));
    return p.type === 'ol' ? webjsx.createElement('ol', null, ...items) : webjsx.createElement('ul', null, ...items);
  },
  alertbox: (p) => webjsx.createElement('div', { class: `alert ${p.type || 'info'}` },
    webjsx.createElement('h4', null, p.title || ''),
    webjsx.createElement('p', null, p.message || '')
  ),
  testimonial: (p) => webjsx.createElement('div', { class: 'testimonial', style: `background: ${p.backgroundColor || '#fff'}; border-left: 4px solid ${p.accentColor || '#2563eb'}` },
    p.rating ? webjsx.createElement('div', { class: 'stars' }, '★'.repeat(p.rating)) : null,
    webjsx.createElement('blockquote', null, p.quote || ''),
    webjsx.createElement('div', { class: 'author' }, p.author || ''),
    webjsx.createElement('div', { class: 'role' }, p.role || '')
  ),
  navbar: (p) => webjsx.createElement('nav', { style: `background: ${p.backgroundColor || '#fff'}; color: ${p.textColor || '#1e293b'}; ${p.sticky ? 'position: sticky; top: 0; z-index: 100;' : ''}` },
    webjsx.createElement('div', { class: 'logo' }, p.logoText || ''),
    webjsx.createElement('div', { class: 'links' },
      ...(p.links || []).map(l => webjsx.createElement('a', { href: l.href, style: `color: ${p.textColor || '#1e293b'}` }, l.label))
    )
  ),
  footerblock: (p) => webjsx.createElement('footer', { style: `background: ${p.backgroundColor || '#1e293b'}; color: ${p.textColor || '#94a3b8'}` },
    webjsx.createElement('div', { class: 'links' },
      ...(p.links || []).map(l => webjsx.createElement('a', { href: l.href, style: `color: ${p.textColor || '#94a3b8'}` }, l.label))
    ),
    webjsx.createElement('div', { class: 'copyright' }, `${p.showYear !== false ? '© ' + new Date().getFullYear() + ' ' : ''}${p.copyrightText || ''}`)
  ),
  pricingcard: (p) => webjsx.createElement('div', { class: 'pricing', style: `background: ${p.backgroundColor || '#fff'}; ${p.highlighted ? `border: 2px solid ${p.accentColor || '#2563eb'}; box-shadow: 0 8px 30px rgba(37,99,235,0.15);` : 'border: 1px solid #e2e8f0;'}` },
    webjsx.createElement('div', { class: 'plan' }, p.planName || ''),
    webjsx.createElement('div', { class: 'price' }, p.price || '', webjsx.createElement('span', { class: 'period' }, p.period || '')),
    webjsx.createElement('ul', null, ...(p.features || []).map(f => webjsx.createElement('li', null, '✓ ' + f))),
    webjsx.createElement('a', { href: p.ctaHref || '#', class: 'cta', style: `background: ${p.accentColor || '#2563eb'}; color: #fff` }, p.ctaText || '')
  ),
  contactform: (p) => webjsx.createElement('form', { action: p.formAction || '', method: 'POST' },
    webjsx.createElement('label', null, p.nameLabel || 'Name', webjsx.createElement('input', { type: 'text', name: 'name', required: true })),
    webjsx.createElement('label', null, p.emailLabel || 'Email', webjsx.createElement('input', { type: 'email', name: 'email', required: true })),
    p.showPhone ? webjsx.createElement('label', null, 'Phone', webjsx.createElement('input', { type: 'tel', name: 'phone' })) : null,
    webjsx.createElement('label', null, p.messageLabel || 'Message', webjsx.createElement('textarea', { name: 'message', required: true })),
    webjsx.createElement('button', { type: 'submit' }, p.submitButtonText || 'Send')
  ),
};

const registered = new Set();

export function registerAllComponents() {
  const types = Object.keys(renderers);
  for (const type of types) {
    const tagName = `${TAG_PREFIX}-${type}`;
    if (registered.has(tagName)) continue;
    if (!customElements.get(tagName)) {
      customElements.define(tagName, createBaseClass(type));
      registered.add(tagName);
    }
  }
}

export function getTagName(componentType) {
  return `${TAG_PREFIX}-${componentType.toLowerCase()}`;
}

export { renderers };
