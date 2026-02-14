import React, { useState, useMemo } from 'react';
import { styles as baseStyles } from './pageManagerStyles';

const TEMPLATES = [
  {
    id: 'blank',
    label: 'Blank Page',
    description: 'Empty canvas to build from scratch',
    icon: '+',
    build: (title) => [],
  },
  {
    id: 'landing',
    label: 'Landing Page',
    description: 'Hero section, features grid, and call-to-action',
    icon: 'L',
    build: (title) => [
      { id: `hero-${Date.now()}`, type: 'Container', props: { maxWidth: '1200px' }, style: { padding: '64px 24px', textAlign: 'center' }, children: [
        { id: `h-${Date.now()}`, type: 'Heading', props: { level: 1, children: title }, style: {}, children: [] },
        { id: `sub-${Date.now()}`, type: 'Text', props: { children: 'A brief description of what this page is about.' }, style: {}, children: [] },
        { id: `cta-${Date.now()}`, type: 'Button', props: { children: 'Get Started', variant: 'primary' }, style: {}, children: [] },
      ]},
      { id: `feat-${Date.now()}`, type: 'Grid', props: { columns: 3, gap: '24px' }, style: { padding: '48px 24px' }, children: [
        { id: `c1-${Date.now()}`, type: 'Card', props: { title: 'Feature One', children: 'Description of the first feature.' }, style: {}, children: [] },
        { id: `c2-${Date.now()+1}`, type: 'Card', props: { title: 'Feature Two', children: 'Description of the second feature.' }, style: {}, children: [] },
        { id: `c3-${Date.now()+2}`, type: 'Card', props: { title: 'Feature Three', children: 'Description of the third feature.' }, style: {}, children: [] },
      ]},
    ],
  },
  {
    id: 'content',
    label: 'Content Page',
    description: 'Heading with text sections for articles or docs',
    icon: 'C',
    build: (title) => [
      { id: `cont-${Date.now()}`, type: 'Container', props: { maxWidth: '800px' }, style: { padding: '48px 24px' }, children: [
        { id: `h1-${Date.now()}`, type: 'Heading', props: { level: 1, children: title }, style: {}, children: [] },
        { id: `t1-${Date.now()}`, type: 'Text', props: { children: 'Introduction paragraph. Replace this with your content.' }, style: {}, children: [] },
        { id: `d1-${Date.now()}`, type: 'Divider', props: {}, style: { margin: '32px 0' }, children: [] },
        { id: `h2-${Date.now()}`, type: 'Heading', props: { level: 2, children: 'Section Title' }, style: {}, children: [] },
        { id: `t2-${Date.now()+1}`, type: 'Text', props: { children: 'Section content goes here.' }, style: {}, children: [] },
      ]},
    ],
  },
];

const RESERVED_NAMES = ['admin', 'api', 'settings', 'login', 'auth'];
const MAX_NAME_LENGTH = 64;

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_NAME_LENGTH);
}

function toTitle(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function CreatePageModal({ existingPages, onClose, onSubmit, submitting }) {
  const [pageTitle, setPageTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [validationError, setValidationError] = useState(null);

  const slug = useMemo(() => toSlug(pageTitle), [pageTitle]);

  const isDuplicate = useMemo(
    () => existingPages.some(p => p.name === slug),
    [existingPages, slug]
  );

  const isReserved = useMemo(() => RESERVED_NAMES.includes(slug), [slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!slug) { setValidationError('Page title is required'); return; }
    if (isDuplicate) { setValidationError('A page with this name already exists'); return; }
    if (isReserved) { setValidationError(`"${slug}" is a reserved name`); return; }
    setValidationError(null);
    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    const title = pageTitle.trim() || toTitle(slug);
    onSubmit({ slug, title, components: template.build(title) });
  };

  return (
    <div style={baseStyles.modalBackdrop} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={baseStyles.modalTitle}>Create New Page</h3>
        <form onSubmit={handleSubmit} style={baseStyles.form}>
          <div style={modalStyles.field}>
            <label style={modalStyles.label}>Page Title</label>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => { setPageTitle(e.target.value); setValidationError(null); }}
              placeholder="My New Page"
              autoFocus
              maxLength={MAX_NAME_LENGTH}
              style={baseStyles.input}
            />
          </div>
          {slug && (
            <div style={modalStyles.slugPreview}>
              URL: /{slug}
              {isDuplicate && <span style={modalStyles.errorInline}> - already exists</span>}
              {isReserved && <span style={modalStyles.errorInline}> - reserved name</span>}
            </div>
          )}
          <div style={modalStyles.field}>
            <label style={modalStyles.label}>Template</label>
            <div style={modalStyles.templateGrid}>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    ...modalStyles.templateCard,
                    ...(selectedTemplate === t.id ? modalStyles.templateCardSelected : {}),
                  }}
                >
                  <span style={modalStyles.templateIcon}>{t.icon}</span>
                  <span style={modalStyles.templateLabel}>{t.label}</span>
                  <span style={modalStyles.templateDesc}>{t.description}</span>
                </button>
              ))}
            </div>
          </div>
          {validationError && <div style={modalStyles.error}>{validationError}</div>}
          <div style={baseStyles.modalActions}>
            <button type="submit" disabled={submitting || !slug || isDuplicate || isReserved} style={baseStyles.createButton}>
              {submitting ? 'Creating...' : 'Create Page'}
            </button>
            <button type="button" onClick={onClose} style={baseStyles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalStyles = {
  modal: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    maxWidth: '560px',
    width: '90%',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.813rem', fontWeight: '600', color: '#374151' },
  slugPreview: { fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px' },
  errorInline: { color: '#ef4444', fontWeight: '600' },
  error: { fontSize: '0.813rem', color: '#ef4444', padding: '8px 12px', backgroundColor: '#fef2f2', borderRadius: '6px' },
  templateGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
  templateCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    padding: '16px 8px', border: '2px solid #e5e7eb', borderRadius: '8px',
    backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'center', transition: 'all 150ms',
  },
  templateCardSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  templateIcon: { fontSize: '1.25rem', fontWeight: '700', color: '#2563eb', fontFamily: 'monospace' },
  templateLabel: { fontSize: '0.813rem', fontWeight: '600', color: '#1e293b' },
  templateDesc: { fontSize: '0.688rem', color: '#64748b', lineHeight: '1.3' },
};
