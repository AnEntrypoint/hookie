/**
 * buttonStyles.js
 * Pure style definitions and helper functions for Button component
 * No React dependencies - can be used in any JavaScript context
 */

import {
  variantBaseStyles,
  variantDisabledStyles,
  variantHoverStyles,
  variantActiveStyles,
  variantFocusStyles
} from './buttonVariants';

/**
 * Size style definitions for all button sizes
 */
export const sizeStyles = {
  sm: {
    padding: '8px 16px',
    fontSize: '0.75rem',
    minWidth: '80px',
    height: '32px'
  },
  md: {
    padding: '12px 24px',
    fontSize: '0.875rem',
    minWidth: '100px',
    height: '40px'
  },
  lg: {
    padding: '16px 32px',
    fontSize: '1rem',
    minWidth: '120px',
    height: '48px'
  }
};

/**
 * Get variant styles with disabled state applied
 * @param {string} variant - Button variant (primary, secondary, danger, ghost, success)
 * @param {boolean} disabled - Whether button is disabled
 * @returns {Object} Style object for the variant
 */
export const getVariantStyles = (variant, disabled) => {
  const baseStyle = variantBaseStyles[variant] || variantBaseStyles.primary;
  
  if (!disabled) {
    return baseStyle;
  }

  const disabledStyle = variantDisabledStyles[variant] || variantDisabledStyles.primary;
  return { ...baseStyle, ...disabledStyle };
};

/**
 * Get hover state styles for a variant
 * @param {string} variant - Button variant
 * @returns {Object} Hover style object
 */
export const getHoverStyles = (variant) => {
  return variantHoverStyles[variant] || variantHoverStyles.primary;
};

/**
 * Get active/pressed state styles for a variant
 * @param {string} variant - Button variant
 * @returns {Object} Active style object
 */
export const getActiveStyles = (variant) => {
  return variantActiveStyles[variant] || variantActiveStyles.primary;
};

/**
 * Get focus outline styles for a variant
 * @param {string} variant - Button variant
 * @returns {Object} Focus style object
 */
export const getFocusStyles = (variant) => {
  return variantFocusStyles[variant] || variantFocusStyles.primary;
};
