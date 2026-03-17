import React, { useState, useMemo } from 'react';
import { styles as baseStyles } from './pageManagerStyles';

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

const TEMPLATES = [
  {
    id: 'blank',
    label: 'Blank',
    description: 'Empty canvas',
    icon: '○',
    build: () => [],
  },
  {
    id: 'landing',
    label: 'Landing Page',
    description: 'Hero + features + CTA',
    icon: '🚀',
    build: (title) => [
      { id: uid(), type: 'Hero', props: { headline: title, subheadline: 'A brief description of what this page is about.', ctaText: 'Get Started', ctaHref: '#', background: 'blue' }, style: {}, children: [] },
      { id: uid(), type: 'Section', props: { title: 'Features', padding: 'xl', background: 'white' }, style: {}, children: [
        { id: uid(), type: 'Grid', props: { columns: 3, gap: 'md' }, style: {}, children: [
          { id: uid(), type: 'Card', props: { title: 'Feature One', description: 'Description of the first feature.' }, style: {}, children: [] },
          { id: uid(), type: 'Card', props: { title: 'Feature Two', description: 'Description of the second feature.' }, style: {}, children: [] },
          { id: uid(), type: 'Card', props: { title: 'Feature Three', description: 'Description of the third feature.' }, style: {}, children: [] },
        ]},
      ]},
    ],
  },
  {
    id: 'about',
    label: 'About Page',
    description: 'Heading + text sections',
    icon: '👤',
    build: (title) => [
      { id: uid(), type: 'Section', props: { title, padding: 'xl', background: 'light' }, style: {}, children: [
        { id: uid(), type: 'Text', props: { content: 'Write your introduction here. Tell visitors who you are and what you do.' }, style: {}, children: [] },
      ]},
      { id: uid(), type: 'Divider', props: {}, style: {}, children: [] },
      { id: uid(), type: 'Section', props: { title: 'Our Story', padding: 'lg', background: 'white' }, style: {}, children: [
        { id: uid(), type: 'Text', props: { content: 'Share your story here.' }, style: {}, children: [] },
      ]},
    ],
  },
  {
    id: 'blog',
    label: 'Blog Post',
    description: 'Heading + date + content',
    icon: '✍',
    build: (title) => [
      { id: uid(), type: 'Section', props: { padding: 'lg', background: 'white' }, style: {}, children: [
        { id: uid(), type: 'Heading', props: { text: title, level: 1 }, style: {}, children: [] },
        { id: uid(), type: 'Text', props: { content: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), color: '#64748b', size: 'sm' }, style: {}, children: [] },
        { id: uid(), type: 'Divider', props: {}, style: {}, children: [] },
        { id: uid(), type: 'Text', props: { content: 'Start writing your blog post here. Replace this placeholder text with your actual content.' }, style: {}, children: [] },
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
