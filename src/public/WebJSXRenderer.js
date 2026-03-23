import * as webjsx from 'webjsx';
import { registerAllComponents, getTagName, renderers } from './webjsx-components/registry.js';
import { componentRegistry } from '../lib/componentRegistry.js';

registerAllComponents();

const getDefaultProps = (schema) => {
  if (!schema?.props) return {};
  const defaults = {};
  Object.entries(schema.props).forEach(([k, v]) => { if (v.default !== undefined) defaults[k] = v.default; });
  return defaults;
};

const styleObjToStr = (s) => s ? Object.entries(s).map(([k,v]) => `${k.replace(/([A-Z])/g,'-$1').toLowerCase()}:${v}`).join(';') : '';

function buildVNode(component) {
  if (!component) return null;
  const { type, props, style, children } = component;
  const schema = componentRegistry.getComponent(type);
  if (!schema) return webjsx.createElement('div', { style: 'padding:12px;background:#fee2e2;color:#991b1b;font-size:14px' }, `Unknown: ${type}`);

  const mergedProps = { ...getDefaultProps(schema), ...(props || {}) };
  const tagName = getTagName(type);
  const attrs = { props: JSON.stringify(mergedProps) };
  if (style && Object.keys(style).length) attrs.style = styleObjToStr(style);

  if (children?.length > 0) {
    const childVNodes = children.map(buildVNode).filter(Boolean);
    return webjsx.createElement(tagName, attrs, ...childVNodes);
  }

  return webjsx.createElement(tagName, attrs);
}

export function renderPage(container, pageData) {
  if (!pageData?.components?.length) {
    webjsx.applyDiff(container, webjsx.createElement('div', { style: 'padding:20px;color:#64748b' }, 'No content to display'));
    return;
  }

  const vNodes = pageData.components.map(buildVNode).filter(Boolean);
  webjsx.applyDiff(container, webjsx.createElement('div', { class: 'webjsx-renderer', style: 'width:100%' }, ...vNodes));
}

export function renderPageWithLayout(container, pageData, layout) {
  const content = pageData?.components?.length
    ? pageData.components.map(buildVNode).filter(Boolean)
    : [webjsx.createElement('div', { style: 'padding:20px;color:#64748b' }, 'No content to display')];

  const headerVNode = layout?.header?.enabled
    ? webjsx.createElement('hookie-navbar', { props: JSON.stringify({
        logoText: layout.header.items?.find(i => i.type === 'logo')?.text || '',
        links: layout.header.items?.find(i => i.type === 'nav')?.links || [],
        backgroundColor: layout.header.backgroundColor || '#fff',
        textColor: layout.colors?.text || '#1e293b',
        sticky: layout.header.position === 'sticky',
      })})
    : null;

  const footerVNode = layout?.footer?.enabled
    ? webjsx.createElement('hookie-footerblock', { props: JSON.stringify({
        copyrightText: layout.footer.sections?.find(s => s.title === 'Legal')?.text || '',
        links: layout.footer.sections?.find(s => s.links)?.links?.map(l => ({ label: l.label, href: l.path })) || [],
        backgroundColor: layout.footer.backgroundColor || '#1e293b',
        textColor: layout.footer.color || '#94a3b8',
        showYear: true,
      })})
    : null;

  const nodes = [headerVNode, ...content, footerVNode].filter(Boolean);
  webjsx.applyDiff(container, webjsx.createElement('div', { class: 'webjsx-page' }, ...nodes));
}

export default { renderPage, renderPageWithLayout };
