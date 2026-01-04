export const breakpoints = {
  mobile: 375,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
};

export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.mobile}px)`,
  tablet: `(max-width: ${breakpoints.tablet}px)`,
  laptop: `(max-width: ${breakpoints.laptop}px)`,
  mobileUp: `(min-width: ${breakpoints.mobile + 1}px)`,
  tabletUp: `(min-width: ${breakpoints.tablet + 1}px)`,
  laptopUp: `(min-width: ${breakpoints.laptop + 1}px)`,
};

export const createMediaQuery = (breakpoint, styles) => {
  return {
    [`@media ${breakpoint}`]: styles,
  };
};

export const createResponsiveStyle = (baseStyle, mobileOverrides = {}, tabletOverrides = {}, laptopOverrides = {}) => {
  const result = { ...baseStyle };

  if (Object.keys(mobileOverrides).length > 0) {
    result[`@media (max-width: ${breakpoints.mobile}px)`] = mobileOverrides;
  }
  if (Object.keys(tabletOverrides).length > 0) {
    result[`@media (max-width: ${breakpoints.tablet}px)`] = tabletOverrides;
  }
  if (Object.keys(laptopOverrides).length > 0) {
    result[`@media (max-width: ${breakpoints.laptop}px)`] = laptopOverrides;
  }

  return result;
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

export const flexColumnOnMobile = {
  display: 'flex',
  flexDirection: 'row',
  [`@media (max-width: ${breakpoints.tablet}px)`]: {
    flexDirection: 'column',
  },
};

export const stackOnTablet = {
  display: 'flex',
  [`@media (max-width: ${breakpoints.tablet}px)`]: {
    display: 'block',
  },
};

export const hideOnMobile = {
  [`@media (max-width: ${breakpoints.mobile}px)`]: {
    display: 'none',
  },
};

export const hideOnTablet = {
  [`@media (max-width: ${breakpoints.tablet}px)`]: {
    display: 'none',
  },
};

export const hideOnDesktop = {
  [`@media (min-width: ${breakpoints.tablet + 1}px)`]: {
    display: 'none',
  },
};

export const stickyHeader = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
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

export const getResponsiveFont = (size) => {
  const fonts = responsiveFont[size] || responsiveFont.body;
  return {
    ...fonts.desktop,
    [`@media (max-width: ${breakpoints.laptop}px)`]: fonts.tablet,
    [`@media (max-width: ${breakpoints.tablet}px)`]: fonts.mobile,
  };
};

export const createResponsiveGrid = (columns) => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns.desktop}, 1fr)`,
    gap: '16px',
    [`@media (max-width: ${breakpoints.laptop}px)`]: {
      gridTemplateColumns: `repeat(${columns.laptop}, 1fr)`,
    },
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      gridTemplateColumns: `repeat(${columns.tablet}, 1fr)`,
    },
    [`@media (max-width: ${breakpoints.mobile}px)`]: {
      gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`,
    },
  };
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

export const minTouchSize = {
  minWidth: '44px',
  minHeight: '44px',
};

export const createAccessibleButton = (baseStyle = {}) => {
  return {
    ...minTouchSize,
    ...baseStyle,
    [`@media (max-width: ${breakpoints.tablet}px)`]: {
      minWidth: '44px',
      minHeight: '44px',
      fontSize: '1rem',
      padding: '12px 16px',
      ...(baseStyle[`@media (max-width: ${breakpoints.tablet}px)`] || {}),
    },
  };
};
