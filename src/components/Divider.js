/**
 * Divider Component
 *
 * Elegant horizontal separator for visually dividing content sections.
 * Supports multiple thickness variants, margin presets, colors, and gradient backgrounds.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Get thickness value in pixels based on variant
 * @param {string} thickness - Thickness variant ('thin'|'normal'|'thick')
 * @returns {string} CSS height value
 */
const getThickness = (thickness) => {
  const thicknesses = {
    thin: '0.5px',
    normal: '1px',
    thick: '2px'
  };
  return thicknesses[thickness] || thicknesses.normal;
};

/**
 * Get margin value based on preset
 * @param {string} margin - Margin preset ('sm'|'md'|'lg')
 * @returns {string} CSS margin value
 */
const getMargin = (margin) => {
  const margins = {
    sm: '16px 0',
    md: '28px 0',
    lg: '40px 0'
  };
  return margins[margin] || margins.md;
};

/**
 * Divider Component - Horizontal separator with configurable styling
 *
 * @param {Object} props - Component props
 * @param {string} props.color - Line color or gradient. Default: '#e2e8f0'
 * @param {string} props.thickness - Thickness variant: 'thin'|'normal'|'thick'. Default: 'normal'
 * @param {string} props.margin - Margin preset: 'sm'|'md'|'lg'. Default: 'md'
 * @param {boolean} props.fullWidth - Extend to full container width. Default: true
 * @param {Object} props.style - Additional inline styles to merge
 * @returns {React.ReactElement} Divider element
 */
const Divider = ({
  color = '#e2e8f0',
  thickness = 'normal',
  margin = 'md',
  fullWidth = true,
  style = {}
}) => {
  // Determine if color is a gradient (contains 'gradient' or 'linear')
  const isGradient = typeof color === 'string' && (color.includes('gradient') || color.includes('linear'));

  // Determine if this is a dark divider for shadow effect
  const isDark = typeof color === 'string' && (color.includes('#cbd5e1') || color.includes('#1f2937'));

  const dividerStyle = {
    display: 'block',
    width: fullWidth ? '100%' : 'auto',
    height: getThickness(thickness),
    [isGradient ? 'background' : 'backgroundColor']: color,
    margin: getMargin(margin),
    border: 'none',
    boxSizing: 'border-box',
    borderRadius: '1px',
    transition: 'background 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    ...(isDark && {
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
    }),
    ...style
  };

  return (
    <div
      className="divider"
      style={dividerStyle}
      role="separator"
      aria-orientation="horizontal"
    />
  );
};

Divider.propTypes = {
  color: PropTypes.string,
  thickness: PropTypes.oneOf(['thin', 'normal', 'thick']),
  margin: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  style: PropTypes.object
};

Divider.defaultProps = {
  color: '#e2e8f0',
  thickness: 'normal',
  margin: 'md',
  fullWidth: true,
  style: {}
};

export default Divider;
