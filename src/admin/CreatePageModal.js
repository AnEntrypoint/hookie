import React, { useState, useMemo } from 'react';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl max-w-[560px] w-[90%] shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-slate-800 m-0 mb-6">Create New Page</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.813rem] font-semibold text-slate-700">Page Title</label>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => { setPageTitle(e.target.value); setValidationError(null); }}
              placeholder="My New Page"
              autoFocus
              maxLength={MAX_NAME_LENGTH}
              className="input input-bordered w-full"
            />
          </div>
          {slug && (
            <div className="text-xs text-slate-500 font-mono px-3 py-2 bg-slate-100 rounded-md">
              URL: /{slug}
              {isDuplicate && <span className="text-red-500 font-semibold"> - already exists</span>}
              {isReserved && <span className="text-red-500 font-semibold"> - reserved name</span>}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.813rem] font-semibold text-slate-700">Template</label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`flex flex-col items-center gap-1 py-4 px-2 border-2 rounded-lg bg-white cursor-pointer text-center transition-all ${selectedTemplate === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <span className="text-xl font-bold text-blue-600 font-mono">{t.icon}</span>
                  <span className="text-[0.813rem] font-semibold text-slate-800">{t.label}</span>
                  <span className="text-[0.688rem] text-slate-500 leading-tight">{t.description}</span>
                </button>
              ))}
            </div>
          </div>
          {validationError && <div className="text-[0.813rem] text-red-500 px-3 py-2 bg-red-50 rounded-md">{validationError}</div>}
          <div className="flex gap-3 justify-end">
            <button type="submit" disabled={submitting || !slug || isDuplicate || isReserved} className="btn btn-primary">
              {submitting ? 'Creating...' : 'Create Page'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
