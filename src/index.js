import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './admin/AdminApp.js';
import App from './public/App.js';

const Colors = {
  primary: '#2563eb',
  primaryDark: '#1e40af',
  primaryLight: '#dbeafe',
  primaryDarker: '#1e3a8a',
  accent: '#f59e0b',
  success: '#10b981',
  successLight: '#d1fae5',
  danger: '#ef4444',
  dangerDark: '#dc2626',
  dangerLight: '#fee2e2',
  darkBg: '#0f172a',
  lightBg: '#f8fafc',
  subtleBg: '#f1f5f9',
  border: '#e2e8f0',
  borderDark: '#cbd5e1',
  textDark: '#1e293b',
  textLight: '#64748b',
  textMuted: '#94a3b8',
  textMutedLight: '#cbd5e1',
  glassEffect: 'rgba(255, 255, 255, 0.8)'
};

const Typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  monoFamily: "'Monaco', 'Courier New', monospace",
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.5px'
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.3px'
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.2px'
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6
  },
  small: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5
  },
  xsmall: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.4
  }
};

const Spacing = {
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  56: '56px',
  64: '64px',
  80: '80px'
};

const Shadows = {
  subtle: '0 1px 2px rgba(0,0,0,0.05)',
  small: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  medium: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  large: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  xl: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
  elevationHigh: '0 25px 50px rgba(0,0,0,0.15), 0 15px 20px rgba(0,0,0,0.08)',
  insetSubtle: 'inset 0 1px 2px rgba(0,0,0,0.05)'
};

const BorderRadius = {
  xs: '2px',
  small: '4px',
  medium: '8px',
  large: '12px',
  xlarge: '16px',
  full: '9999px'
};

const Transitions = {
  instant: '0ms',
  fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)'
};

const Effects = {
  blurLight: 'blur(4px)',
  blurMedium: 'blur(8px)',
  backdropBlur: 'backdrop-filter blur(12px)',
  brightnessHover: 'brightness(1.05)',
  saturationHover: 'saturate(1.1)'
};

const GlobalStyles = () => {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --color-primary: ${Colors.primary};
        --color-primary-dark: ${Colors.primaryDark};
        --color-primary-light: ${Colors.primaryLight};
        --color-primary-darker: ${Colors.primaryDarker};
        --color-accent: ${Colors.accent};
        --color-success: ${Colors.success};
        --color-success-light: ${Colors.successLight};
        --color-danger: ${Colors.danger};
        --color-danger-dark: ${Colors.dangerDark};
        --color-danger-light: ${Colors.dangerLight};
        --color-dark-bg: ${Colors.darkBg};
        --color-light-bg: ${Colors.lightBg};
        --color-subtle-bg: ${Colors.subtleBg};
        --color-border: ${Colors.border};
        --color-border-dark: ${Colors.borderDark};
        --color-text-dark: ${Colors.textDark};
        --color-text-light: ${Colors.textLight};
        --color-text-muted: ${Colors.textMuted};
        --color-text-muted-light: ${Colors.textMutedLight};
        --color-glass: ${Colors.glassEffect};
        
        --font-family: ${Typography.fontFamily};
        --font-mono: ${Typography.monoFamily};
        
        --spacing-4: ${Spacing[4]};
        --spacing-8: ${Spacing[8]};
        --spacing-12: ${Spacing[12]};
        --spacing-16: ${Spacing[16]};
        --spacing-20: ${Spacing[20]};
        --spacing-24: ${Spacing[24]};
        --spacing-32: ${Spacing[32]};
        --spacing-40: ${Spacing[40]};
        --spacing-48: ${Spacing[48]};
        --spacing-56: ${Spacing[56]};
        --spacing-64: ${Spacing[64]};
        --spacing-80: ${Spacing[80]};
        
        --shadow-subtle: ${Shadows.subtle};
        --shadow-small: ${Shadows.small};
        --shadow-medium: ${Shadows.medium};
        --shadow-large: ${Shadows.large};
        --shadow-xl: ${Shadows.xl};
        --shadow-elevation-high: ${Shadows.elevationHigh};
        --shadow-inset-subtle: ${Shadows.insetSubtle};
        
        --radius-xs: ${BorderRadius.xs};
        --radius-small: ${BorderRadius.small};
        --radius-medium: ${BorderRadius.medium};
        --radius-large: ${BorderRadius.large};
        --radius-xlarge: ${BorderRadius.xlarge};
        --radius-full: ${BorderRadius.full};
        
        --transition-instant: ${Transitions.instant};
        --transition-fast: ${Transitions.fast};
        --transition-normal: ${Transitions.normal};
        --transition-smooth: ${Transitions.smooth};
        --transition-slow: ${Transitions.slow};
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html {
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        margin: 0;
        padding: 0;
        font-family: ${Typography.fontFamily};
        font-size: 1rem;
        line-height: 1.6;
        color: ${Colors.textDark};
        background-color: ${Colors.lightBg};
        text-rendering: optimizeLegibility;
      }

      h1, h2, h3, h4, h5, h6 {
        margin: 0;
        font-weight: 600;
        line-height: 1.3;
        letter-spacing: -0.2px;
      }

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.5px;
      }

      h2 {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1.3;
        letter-spacing: -0.3px;
      }

      h3 {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.4;
        letter-spacing: -0.2px;
      }

      h4 {
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.5;
      }

      p {
        margin: 0 0 1rem 0;
      }

      a {
        color: ${Colors.primary};
        text-decoration: none;
        transition: color ${Transitions.normal}, opacity ${Transitions.normal};
      }

      a:hover {
        color: ${Colors.primaryDark};
        opacity: 0.9;
      }

      a:focus {
        outline: 2px solid ${Colors.primary};
        outline-offset: 2px;
      }

      button {
        margin: 0;
        padding: 0;
        border: none;
        background: none;
        font-family: inherit;
        cursor: pointer;
        transition: all ${Transitions.normal};
      }

      button:focus {
        outline: 2px solid ${Colors.primary};
        outline-offset: 2px;
      }

      input, textarea, select {
        font-family: inherit;
        font-size: 1rem;
        line-height: 1.5;
        color: ${Colors.textDark};
        border: 1px solid ${Colors.border};
        border-radius: ${BorderRadius.small};
        padding: 0.75rem;
        transition: border-color ${Transitions.normal}, box-shadow ${Transitions.normal};
      }

      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: ${Colors.primary};
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      textarea {
        resize: vertical;
      }

      code {
        font-family: ${Typography.monoFamily};
        font-size: 0.875rem;
        background-color: ${Colors.subtleBg};
        padding: 0.2rem 0.4rem;
        border-radius: ${BorderRadius.small};
      }

      pre {
        background-color: ${Colors.darkBg};
        color: #e0e0e0;
        padding: 1rem;
        border-radius: ${BorderRadius.medium};
        overflow-x: auto;
        font-family: ${Typography.monoFamily};
        font-size: 0.875rem;
        line-height: 1.5;
      }

      pre code {
        background: none;
        padding: 0;
        color: inherit;
      }

      blockquote {
        border-left: 4px solid ${Colors.primary};
        padding-left: 1rem;
        margin: 1rem 0;
        color: ${Colors.textLight};
        font-style: italic;
      }

      ul, ol {
        margin: 1rem 0;
        padding-left: 2rem;
      }

      li {
        margin-bottom: 0.5rem;
      }

      hr {
        border: none;
        border-top: 1px solid ${Colors.border};
        margin: 2rem 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
      }

      th, td {
        border: 1px solid ${Colors.border};
        padding: 0.75rem;
        text-align: left;
      }

      th {
        background-color: ${Colors.subtleBg};
        font-weight: 600;
      }

      tr:nth-child(even) {
        background-color: ${Colors.lightBg};
      }

      img {
        max-width: 100%;
        height: auto;
        display: block;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideIn {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .app-error {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${Colors.darkBg};
        color: ${Colors.lightBg};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        font-family: ${Typography.fontFamily};
        z-index: 9999;
      }

      .app-error h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: ${Colors.danger};
      }

      .app-error pre {
        max-width: 600px;
        margin: 1rem 0;
        font-size: 0.75rem;
      }

      .app-error button {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background-color: ${Colors.primary};
        color: white;
        border-radius: ${BorderRadius.medium};
        font-weight: 600;
        cursor: pointer;
        transition: background-color ${Transitions.normal};
      }

      .app-error button:hover {
        background-color: ${Colors.primaryDark};
      }
    `;
    document.head.appendChild(style);
  }, []);

  return null;
};

const ErrorBoundary = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: Colors.darkBg,
          color: Colors.lightBg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: Typography.fontFamily,
          zIndex: 9999
        }}>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: Colors.danger
          }}>
            Something went wrong
          </h1>
          <pre style={{
            maxWidth: '600px',
            padding: '1rem',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: BorderRadius.medium,
            fontSize: '0.75rem',
            overflow: 'auto',
            maxHeight: '200px',
            textAlign: 'left'
          }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: Colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: BorderRadius.medium,
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: `background-color ${Transitions.normal}`
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = Colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = Colors.primary;
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
};

const isAdmin = window.location.pathname.includes('/admin');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <GlobalStyles />
      {isAdmin ? <AdminApp /> : <App />}
    </ErrorBoundary>
  </React.StrictMode>
);

export default root;
