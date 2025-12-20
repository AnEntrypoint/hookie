import React from 'react';

/**
 * Section Component
 * Flexible container component that wraps content with elegant spacing,
 * backgrounds, and optional section titles.
 *
 * @param {Object} props - Component props
 * @param {string} [props.title] - Section title to display above children
 * @param {string} [props.padding='md'] - Padding preset ('sm'|'md'|'lg'|'xl')
 * @param {string} [props.background='transparent'] - Background color or gradient
 * @param {boolean} [props.fullWidth=false] - Ignore max-width constraint
 * @param {React.ReactNode} [props.children] - Child components to render inside
 * @param {Object} [props.style] - Additional inline styles to merge
 * @returns {React.ReactElement} Section container with optional title and children
 */
const Section = ({
  title,
  padding = 'md',
  background = 'transparent',
  fullWidth = false,
  children,
  style
}) => {
  /**
   * Helper function to get padding value from preset
   * Updated values: sm: 20px, md: 36px, lg: 56px, xl: 72px
   */
  const getPadding = (paddingProp) => {
    const paddings = {
      sm: '20px',
      md: '36px',
      lg: '56px',
      xl: '72px'
    };
    return paddings[paddingProp] || paddings.md;
  };

  /**
   * Container styles with padding, background, and layout
   */
  const containerStyle = {
    width: fullWidth ? '100%' : 'auto',
    maxWidth: fullWidth ? '100%' : '1200px',
    margin: fullWidth ? '0' : '0 auto',
    padding: getPadding(padding),
    backgroundColor: background,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: background !== 'transparent' ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
    ...style
  };

  /**
   * Title styles with proper typography and spacing
   */
  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#1e293b',
    margin: '0 0 28px 0',
    letterSpacing: '-0.6px',
    textTransform: 'none'
  };

  return (
    <div className="section" style={containerStyle}>
      {title && <h2 style={titleStyle}>{title}</h2>}
      {children}
    </div>
  );
};

export default Section;
