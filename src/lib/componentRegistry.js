const schemas = {
  Button: {
    name: 'Button',
    description: 'A clickable button component',
    props: { text: { type: 'string', default: 'Click me' }, onClick: { type: 'function' } },
    allowedChildren: [],
    defaultStyle: { padding: '10px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
  },
  Text: {
    name: 'Text',
    description: 'Display text content',
    props: { content: { type: 'string', default: '' } },
    allowedChildren: [],
    defaultStyle: { margin: '10px 0', lineHeight: '1.6' }
  },
  Container: {
    name: 'Container',
    description: 'Layout container',
    props: { maxWidth: { type: 'string', default: '1200px' } },
    allowedChildren: ['*'],
    defaultStyle: { maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }
  },
  Heading: {
    name: 'Heading',
    description: 'Heading text',
    props: { level: { type: 'number', default: 1 }, text: { type: 'string', default: '' } },
    allowedChildren: [],
    defaultStyle: { margin: '20px 0 10px 0', fontWeight: '600' }
  },
  Image: {
    name: 'Image',
    description: 'Image component',
    props: { src: { type: 'string', default: '' }, alt: { type: 'string', default: '' } },
    allowedChildren: [],
    defaultStyle: { maxWidth: '100%', height: 'auto', display: 'block' }
  },
  Divider: {
    name: 'Divider',
    description: 'Horizontal divider',
    props: {},
    allowedChildren: [],
    defaultStyle: { width: '100%', height: '1px', backgroundColor: '#e0e0e0', margin: '16px 0', border: 'none' }
  },
  Section: {
    name: 'Section',
    description: 'Content section',
    props: {},
    allowedChildren: ['*'],
    defaultStyle: { padding: '20px 0' }
  },
  Grid: {
    name: 'Grid',
    description: 'Grid layout',
    props: {},
    allowedChildren: ['*'],
    defaultStyle: { display: 'grid', gap: '16px' }
  },
  Link: {
    name: 'Link',
    description: 'Link component',
    props: { href: { type: 'string', default: '#' }, text: { type: 'string', default: '' } },
    allowedChildren: [],
    defaultStyle: { color: '#007bff', textDecoration: 'none', cursor: 'pointer' }
  },
  List: {
    name: 'List',
    description: 'List component',
    props: { items: { type: 'array', default: [] } },
    allowedChildren: [],
    defaultStyle: { listStyle: 'none', padding: '0' }
  },
  Card: {
    name: 'Card',
    description: 'A reusable card component for displaying content with customizable styling',
    version: '1.0.0',
    props: {
      title: { type: 'string', default: '' },
      description: { type: 'string', default: '' },
      imageUrl: { type: 'string', default: '' },
      imageAlt: { type: 'string', default: '' },
      accentColor: { type: 'string', default: '#007bff' },
      backgroundColor: { type: 'string', default: '#ffffff' },
      padding: { type: 'string', default: '20px' },
      borderRadius: { type: 'string', default: '8px' },
      shadowSize: { type: 'string', default: 'medium' }
    },
    allowedChildren: [],
    defaultStyle: { display: 'inline-block', minWidth: '250px', maxWidth: '400px' }
  }
};

export function registerComponent(name, schema) {
  schemas[name] = schema;
}

export function getComponent(name) {
  return schemas[name] || null;
}

export function getAllComponents() {
  return Object.keys(schemas);
}

export function validateComponentProps(componentName, props) {
  const schema = getComponent(componentName);
  return !!schema;
}

export function canContainChild(parentType, childType) {
  const schema = schemas[parentType];
  if (!schema) return true;
  const allowed = schema.allowedChildren || [];
  return allowed.includes('*') || allowed.includes(childType);
}

export const componentRegistry = {
  registerComponent,
  getComponent,
  getAllComponents,
  validateComponentProps,
  canContainChild
};

export default componentRegistry;
