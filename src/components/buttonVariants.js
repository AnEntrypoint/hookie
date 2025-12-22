/**
 * buttonVariants.js
 * Variant-specific style definitions for Button component
 * No React dependencies
 */

/**
 * Base style definitions for all button variants
 */
export const variantBaseStyles = {
  primary: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 700,
    letterSpacing: '0.4px',
    cursor: 'pointer',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    userSelect: 'none'
  },
  secondary: {
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    color: '#1e293b',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    userSelect: 'none'
  },
  danger: {
    background: 'transparent',
    color: '#dc2626',
    border: '2px solid #dc2626',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.15)',
    userSelect: 'none'
  },
  ghost: {
    background: 'transparent',
    color: '#64748b',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'none',
    userSelect: 'none'
  },
  success: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    userSelect: 'none'
  }
};

/**
 * Disabled state styles for each variant
 */
export const variantDisabledStyles = {
  primary: {
    background: '#cbd5e1',
    opacity: 0.6,
    boxShadow: 'none',
    cursor: 'not-allowed'
  },
  secondary: {
    background: '#f1f5f9',
    color: '#cbd5e1',
    borderColor: '#e2e8f0',
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  danger: {
    color: '#fecaca',
    borderColor: '#fecaca',
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  ghost: {
    color: '#cbd5e1',
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  success: {
    background: '#cbd5e1',
    opacity: 0.6,
    boxShadow: 'none',
    cursor: 'not-allowed'
  }
};

/**
 * Hover state styles for each variant
 */
export const variantHoverStyles = {
  primary: {
    background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
    transform: 'translateY(-2px)',
    filter: 'brightness(1.08)'
  },
  secondary: {
    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    borderColor: '#94a3b8',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)'
  },
  danger: {
    background: 'rgba(220, 38, 38, 0.08)',
    borderColor: '#b91c1c',
    boxShadow: '0 6px 20px rgba(220, 38, 38, 0.3)',
    transform: 'translateY(-2px)'
  },
  ghost: {
    background: '#f1f5f9',
    color: '#1e293b',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
  },
  success: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
    transform: 'translateY(-2px)'
  }
};

/**
 * Active/pressed state styles for each variant
 */
export const variantActiveStyles = {
  primary: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e3a8a 100%)',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
    transform: 'translateY(0)'
  },
  secondary: {
    background: 'linear-gradient(135deg, #cbd5e1 0%, #cbd5e1 100%)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transform: 'translateY(0)'
  },
  danger: {
    background: 'rgba(220, 38, 38, 0.15)',
    borderColor: '#991b1b',
    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
    transform: 'translateY(0)'
  },
  ghost: {
    background: '#e2e8f0',
    color: '#0f172a'
  },
  success: {
    background: 'linear-gradient(135deg, #047857 0%, #047857 100%)',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
    transform: 'translateY(0)'
  }
};

/**
 * Focus outline styles for each variant
 */
export const variantFocusStyles = {
  primary: {
    outline: '3px solid rgba(37, 99, 235, 0.5)',
    outlineOffset: '2px'
  },
  secondary: {
    outline: '3px solid rgba(37, 99, 235, 0.4)',
    outlineOffset: '2px'
  },
  danger: {
    outline: '3px solid rgba(220, 38, 38, 0.4)',
    outlineOffset: '2px'
  },
  ghost: {
    outline: '2px solid #2563eb',
    outlineOffset: '2px'
  },
  success: {
    outline: '3px solid rgba(16, 185, 129, 0.4)',
    outlineOffset: '2px'
  }
};
