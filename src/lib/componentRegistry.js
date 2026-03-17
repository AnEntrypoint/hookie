const schemas = {
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
  Card: {
    name: 'Card',
    description: 'A card for displaying content with title, description, and optional image',
    category: 'Display',
    icon: '🃏',
    props: {
      title: { type: 'string', default: 'Card Title' },
      description: { type: 'string', default: 'Card description text goes here.' },
      imageUrl: { type: 'string', default: '' },
      imageAlt: { type: 'string', default: '' },
      accentColor: { type: 'string', default: '#2563eb' },
      backgroundColor: { type: 'string', default: '#ffffff' },
      padding: { type: 'string', default: '24px' },
      borderRadius: { type: 'string', default: '12px' },
      shadowSize: { type: 'string', default: 'medium', enum: ['small', 'medium', 'large'] },
    },
    allowedChildren: [],
    defaultStyle: { width: '100%' }
  },
  AlertBox: {
    name: 'AlertBox',
    description: 'An info, warning, error, or success alert message',
    category: 'Display',
    icon: '⚠',
    props: {
      type: { type: 'string', default: 'info', enum: ['info', 'warning', 'error', 'success'] },
      title: { type: 'string', default: 'Alert Title' },
      message: { type: 'string', default: 'Alert message content goes here.' },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  Hero: {
    name: 'Hero',
    description: 'A full-width hero banner with headline, subheadline, and CTA buttons',
    category: 'Layout',
    icon: '🦸',
    props: {
      headline: { type: 'string', default: 'Build Something Amazing' },
      subheadline: { type: 'string', default: 'The modern way to create websites.' },
      ctaText: { type: 'string', default: 'Get Started' },
      ctaHref: { type: 'string', default: '#' },
      secondaryCtaText: { type: 'string', default: '' },
      secondaryCtaHref: { type: 'string', default: '#' },
      background: { type: 'string', default: 'blue', enum: ['white', 'light', 'dark', 'blue', 'purple', 'green', 'sunset', 'midnight'] },
      backgroundImage: { type: 'string', default: '' },
      textAlign: { type: 'string', default: 'center', enum: ['center', 'left'] },
      textColor: { type: 'string', default: '#ffffff' },
      minHeight: { type: 'string', default: '480px' },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  Testimonial: {
    name: 'Testimonial',
    description: 'A customer testimonial with quote, author, and star rating',
    category: 'Display',
    icon: '💬',
    props: {
      quote: { type: 'string', default: 'This product completely changed how we work. Highly recommended!' },
      author: { type: 'string', default: 'Jane Smith' },
      role: { type: 'string', default: 'CEO, Acme Corp' },
      avatarUrl: { type: 'string', default: '' },
      rating: { type: 'number', default: 5 },
      accentColor: { type: 'string', default: '#2563eb' },
      backgroundColor: { type: 'string', default: '#ffffff' },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  Navbar: {
    name: 'Navbar',
    description: 'A page-level navigation bar with logo and links',
    category: 'Layout',
    icon: '🧭',
    props: {
      logoText: { type: 'string', default: 'My Site' },
      links: { type: 'array', default: [{ label: 'Home', href: '#/' }, { label: 'About', href: '#/pages/about' }] },
      backgroundColor: { type: 'string', default: '#ffffff' },
      textColor: { type: 'string', default: '#1e293b' },
      sticky: { type: 'boolean', default: false },
      ctaText: { type: 'string', default: '' },
      ctaHref: { type: 'string', default: '#' },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  FooterBlock: {
    name: 'FooterBlock',
    description: 'A page-level footer with copyright and links',
    category: 'Layout',
    icon: '🔻',
    props: {
      copyrightText: { type: 'string', default: 'My Site. All rights reserved.' },
      links: { type: 'array', default: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
      backgroundColor: { type: 'string', default: '#1e293b' },
      textColor: { type: 'string', default: '#94a3b8' },
      showYear: { type: 'boolean', default: true },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  PricingCard: {
    name: 'PricingCard',
    description: 'A pricing tier card with features list and CTA',
    category: 'Display',
    icon: '💰',
    props: {
      planName: { type: 'string', default: 'Pro Plan' },
      price: { type: 'string', default: '$29' },
      period: { type: 'string', default: '/month' },
      features: { type: 'array', default: ['Unlimited pages', 'Custom components', 'GitHub storage', 'Priority support'] },
      ctaText: { type: 'string', default: 'Get Started' },
      ctaHref: { type: 'string', default: '#' },
      highlighted: { type: 'boolean', default: false },
      accentColor: { type: 'string', default: '#2563eb' },
      backgroundColor: { type: 'string', default: '#ffffff' },
    },
    allowedChildren: [],
    defaultStyle: {}
  },
  ContactForm: {
    name: 'ContactForm',
    description: 'A contact form that submits to Formspree or any POST endpoint',
    category: 'Interactive',
    icon: '📬',
    props: {
      formAction: { type: 'string', default: '' },
      submitButtonText: { type: 'string', default: 'Send Message' },
      successMessage: { type: 'string', default: "Thanks! We'll get back to you soon." },
      nameLabel: { type: 'string', default: 'Name' },
      emailLabel: { type: 'string', default: 'Email' },
      messageLabel: { type: 'string', default: 'Message' },
      showPhone: { type: 'boolean', default: false },
    },
    allowedChildren: [],
    defaultStyle: {}
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
  return !!getComponent(componentName);
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
