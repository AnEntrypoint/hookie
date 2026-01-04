export const breakpoints = {
  mobile: 375,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
};

export const minTouchSize = {
  minWidth: '44px',
  minHeight: '44px',
};

export const responsiveValues = {
  headerHeight: {
    mobile: '56px',
    tablet: '64px',
    desktop: '72px',
  },
  sidebarWidth: {
    mobile: '100%',
    tablet: '280px',
    desktop: '320px',
  },
  minTouchTarget: '44px',
  padding: {
    mobile: '12px',
    tablet: '16px',
    desktop: '24px',
  },
  gap: {
    mobile: '8px',
    tablet: '12px',
    desktop: '16px',
  },
};

export const responsiveFont = {
  h1: {
    desktop: { fontSize: '2rem', lineHeight: '1.2' },
    tablet: { fontSize: '1.5rem', lineHeight: '1.3' },
    mobile: { fontSize: '1.25rem', lineHeight: '1.4' },
  },
  h2: {
    desktop: { fontSize: '1.5rem', lineHeight: '1.2' },
    tablet: { fontSize: '1.25rem', lineHeight: '1.3' },
    mobile: { fontSize: '1.125rem', lineHeight: '1.4' },
  },
  body: {
    desktop: { fontSize: '1rem', lineHeight: '1.5' },
    tablet: { fontSize: '0.9375rem', lineHeight: '1.6' },
    mobile: { fontSize: '0.875rem', lineHeight: '1.6' },
  },
  small: {
    desktop: { fontSize: '0.875rem', lineHeight: '1.4' },
    tablet: { fontSize: '0.8125rem', lineHeight: '1.5' },
    mobile: { fontSize: '0.75rem', lineHeight: '1.5' },
  },
};

export const responsiveContainer = {
  mobile: {
    padding: '12px',
    maxWidth: '100%',
  },
  tablet: {
    padding: '16px',
    maxWidth: '100%',
  },
  desktop: {
    padding: '24px',
    maxWidth: '100%',
  },
};
