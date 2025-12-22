// theme.js - Centralized design system tokens

// Color Palette
export const colors = {
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
  glass: 'rgba(255, 255, 255, 0.8)',
};

// Typography Scale
export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  monospace: "'Monaco', 'Courier New', monospace",
  h1: {
    size: '2.5rem',
    weight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
  },
  h2: {
    size: '2rem',
    weight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.3px',
  },
  h3: {
    size: '1.5rem',
    weight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.2px',
  },
  h4: {
    size: '1.25rem',
    weight: 600,
    lineHeight: 1.5,
  },
  body: {
    size: '1rem',
    weight: 400,
    lineHeight: 1.6,
  },
  small: {
    size: '0.875rem',
    weight: 400,
    lineHeight: 1.5,
  },
  xsmall: {
    size: '0.75rem',
    weight: 500,
    lineHeight: 1.4,
  },
};

// Spacing Scale (multiples of 4px)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '40px',
  '4xl': '48px',
  '5xl': '56px',
  '6xl': '64px',
  '7xl': '80px',
};

// Shadow Definitions
export const shadows = {
  subtle: '0 1px 2px rgba(0,0,0,0.05)',
  small: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  medium: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  large: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  xl: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
  elevationHigh: '0 25px 50px rgba(0,0,0,0.15), 0 15px 20px rgba(0,0,0,0.08)',
  insetSubtle: 'inset 0 1px 2px rgba(0,0,0,0.05)',
};

// Border Radius Values
export const borderRadius = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// Transition Timings
export const transitions = {
  instant: '0ms',
  fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// Effect Filters
export const effects = {
  blurLight: 'blur(4px)',
  blurMedium: 'blur(8px)',
  backdropBlur: 'blur(12px)',
  brightnessHover: 'brightness(1.05)',
  saturationHover: 'saturate(1.1)',
};
