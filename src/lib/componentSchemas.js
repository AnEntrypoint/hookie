export const builtinSchemas = {
  Button: {
    name: 'Button',
    description: 'A clickable button with multiple variants and sizes',
    category: 'Interactive',
    icon: '🔘',
    props: {
      label: { type: 'string', default: 'Click me' },
      variant: { type: 'string', default: 'primary', enum: ['primary', 'secondary', 'outline', 'ghost', 'danger'] },
      size: { type: 'string', default: 'md', enum: ['sm', 'md', 'lg'] },
      disabled: { type: 'boolean', default: false },
      fullWidth: { type: 'boolean', default: false },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  Text: {
    name: 'Text',
    description: 'Paragraph text with configurable size, color, and alignment',
    category: 'Content',
    icon: 'T',
    props: {
      content: { type: 'string', default: 'Enter your text here' },
      size: { type: 'string', default: 'base', enum: ['sm', 'base', 'lg', 'xl'] },
      color: { type: 'string', default: '#1e293b' },
      weight: { type: 'string', default: 'normal', enum: ['normal', 'semibold', 'bold'] },
      align: { type: 'string', default: 'left', enum: ['left', 'center', 'right'] },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  Heading: {
    name: 'Heading',
    description: 'Section heading from H1 to H6',
    category: 'Content',
    icon: 'H',
    props: {
      text: { type: 'string', default: 'Your Heading' },
      level: { type: 'number', default: 2 },
      color: { type: 'string', default: '#1e293b' },
      align: { type: 'string', default: 'left', enum: ['left', 'center', 'right'] },
      weight: { type: 'string', default: 'bold', enum: ['normal', 'semibold', 'bold'] },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  Section: {
    name: 'Section',
    description: 'A content section with title, background and padding options',
    category: 'Layout',
    icon: '▭',
    props: {
      title: { type: 'string', default: '' },
      subtitle: { type: 'string', default: '' },
      padding: { type: 'string', default: 'md', enum: ['sm', 'md', 'lg', 'xl', '2xl'] },
      background: { type: 'string', default: 'transparent', enum: ['transparent', 'white', 'light', 'subtle', 'gradient-blue', 'gradient-green', 'gradient-purple'] },
      fullWidth: { type: 'boolean', default: false },
    },
    allowedChildren: ['*'],
    defaultStyle: {}
  },
  Container: {
    name: 'Container',
    description: 'A centered layout container with max-width and padding',
    category: 'Layout',
    icon: '□',
    props: {
      maxWidth: { type: 'string', default: 'xl', enum: ['sm', 'md', 'lg', 'xl', '2xl'] },
      padding: { type: 'string', default: 'md', enum: ['none', 'sm', 'md', 'lg', 'xl', '2xl'] },
    },
    allowedChildren: ['*'],
    defaultStyle: {}
  },
  Grid: {
    name: 'Grid',
    description: 'A responsive grid layout for multiple columns',
    category: 'Layout',
    icon: '⊞',
    props: {
      columns: { type: 'number', default: 3 },
      gap: { type: 'string', default: 'md', enum: ['sm', 'md', 'lg', 'xl'] },
      minItemWidth: { type: 'string', default: '280px' },
      autoFit: { type: 'boolean', default: false },
    },
    allowedChildren: ['*'],
    defaultStyle: {}
  },
  Image: {
    name: 'Image',
    description: 'An image with lazy loading, shadow, and hover effects',
    category: 'Content',
    icon: '🖼',
    props: {
      src: { type: 'string', default: 'https://placehold.co/600x400' },
      alt: { type: 'string', default: 'Image' },
      width: { type: 'string', default: '100%' },
      height: { type: 'string', default: 'auto' },
      objectFit: { type: 'string', default: 'cover', enum: ['cover', 'contain', 'fill', 'none'] },
      borderRadius: { type: 'string', default: 'md', enum: ['xs', 'sm', 'md', 'lg', 'xl', 'full'] },
      shadow: { type: 'string', default: 'md', enum: ['none', 'sm', 'md', 'lg', 'xl'] },
      effect: { type: 'string', default: 'none', enum: ['none', 'lift', 'zoom', 'glow'] },
      lazy: { type: 'boolean', default: true },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  Divider: {
    name: 'Divider',
    description: 'A horizontal divider line with style options',
    category: 'Layout',
    icon: '—',
    props: {
      color: { type: 'string', default: 'default', enum: ['default', 'dark', 'primary', 'success', 'danger', 'muted'] },
      variant: { type: 'string', default: 'solid', enum: ['solid', 'dashed', 'dotted', 'gradient'] },
      thickness: { type: 'string', default: 'normal', enum: ['thin', 'normal', 'thick', 'xl'] },
      margin: { type: 'string', default: 'md', enum: ['sm', 'md', 'lg', 'xl'] },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  Link: {
    name: 'Link',
    description: 'A hyperlink with button, pill, underline, or default styles',
    category: 'Interactive',
    icon: '🔗',
    props: {
      text: { type: 'string', default: 'Click here' },
      href: { type: 'string', default: '#' },
      variant: { type: 'string', default: 'default', enum: ['default', 'underline', 'button', 'pill'] },
      color: { type: 'string', default: 'primary', enum: ['primary', 'secondary', 'success', 'danger', 'muted'] },
      size: { type: 'string', default: 'md', enum: ['sm', 'md', 'lg'] },
      newTab: { type: 'boolean', default: false },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  List: {
    name: 'List',
    description: 'An ordered or unordered list with customizable style',
    category: 'Content',
    icon: '≡',
    props: {
      items: { type: 'array', default: ['First item', 'Second item', 'Third item'] },
      type: { type: 'string', default: 'ul', enum: ['ul', 'ol'] },
      color: { type: 'string', default: 'default', enum: ['default', 'primary', 'success', 'danger', 'muted'] },
      spacing: { type: 'string', default: 'md', enum: ['sm', 'md', 'lg', 'xl'] },
      bulletStyle: { type: 'string', default: 'disc', enum: ['disc', 'circle', 'square', 'check', 'arrow', 'dot'] },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
};
