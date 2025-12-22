// Color Definitions
export const COLORS = {
  primary: {
    base: '#2563eb',
    hover: '#1e40af',
    active: '#1e3a8a'
  },
  success: {
    base: '#10b981',
    hover: '#059669',
    active: '#047857'
  },
  danger: {
    base: '#ef4444',
    hover: '#dc2626',
    active: '#991b1b'
  },
  muted: {
    base: '#64748b',
    hover: '#475569',
    active: '#1e293b'
  }
};

// Base Styles
export const baseStyles = {
  cursor: 'pointer',
  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  outline: 'none',
  textDecoration: 'none'
};

export const focusStyles = {
  outline: '3px solid rgba(37, 99, 235, 0.5)',
  outlineOffset: '2px'
};

// Variant Styles
export const defaultVariantStyles = {
  ...baseStyles,
  position: 'relative',
  fontWeight: '600',
  borderBottom: '2px solid transparent'
};

export function getDefaultVariantHoverStyles(color) {
  return {
    color: COLORS[color]?.hover || COLORS.primary.hover,
    borderBottomColor: COLORS[color]?.hover || COLORS.primary.hover,
    transform: 'translateX(2px)'
  };
}

export const underlineVariantStyles = {
  ...baseStyles,
  fontWeight: '600',
  textDecoration: 'underline'
};

export function getUnderlineVariantHoverStyles(color) {
  return {
    color: COLORS[color]?.hover || COLORS.primary.hover,
    filter: 'brightness(1.1)'
  };
}

export function getButtonVariantStyles(color, size) {
  const colorValue = COLORS[color]?.base || COLORS.primary.base;
  const padding = {
    sm: '8px 16px',
    md: '10px 20px',
    lg: '12px 24px'
  }[size] || '10px 20px';
  
  return {
    ...baseStyles,
    display: 'inline-block',
    backgroundColor: colorValue,
    color: '#ffffff',
    padding,
    borderRadius: '8px',
    fontWeight: '600',
    boxShadow: `0 2px 8px rgba(${hexToRgb(colorValue)}, 0.3)`,
    border: 'none'
  };
}

export function getButtonVariantHoverStyles(color) {
  const hoverColor = COLORS[color]?.hover || COLORS.primary.hover;
  return {
    backgroundColor: hoverColor,
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px rgba(${hexToRgb(hoverColor)}, 0.4)`
  };
}

export function getButtonVariantActiveStyles(color) {
  const activeColor = COLORS[color]?.active || COLORS.primary.active;
  return {
    backgroundColor: activeColor,
    transform: 'translateY(0)',
    boxShadow: `0 2px 6px rgba(${hexToRgb(activeColor)}, 0.3)`
  };
}

export function getPillVariantStyles(color, size) {
  const colorValue = COLORS[color]?.base || COLORS.primary.base;
  const padding = {
    sm: '8px 16px',
    md: '10px 20px',
    lg: '12px 24px'
  }[size] || '10px 20px';
  
  return {
    ...baseStyles,
    display: 'inline-block',
    backgroundColor: `rgba(${hexToRgb(colorValue)}, 0.1)`,
    color: colorValue,
    padding,
    borderRadius: '9999px',
    border: `2px solid ${colorValue}`,
    fontWeight: '600'
  };
}

export function getPillVariantHoverStyles(color) {
  return {
    backgroundColor: COLORS[color]?.base || COLORS.primary.base,
    color: '#ffffff',
    transform: 'scale(1.05)'
  };
}

// Size Styles
export function getSizeStyles(size) {
  const sizeMap = {
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    md: { fontSize: '1rem', lineHeight: '1.5rem' },
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' }
  };
  
  return sizeMap[size] || sizeMap.md;
}

// Custom Color Support
export function getCustomColorStyles(customColor) {
  // Darken color for hover (simple approximation)
  const darken = (hex, percent) => {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };
  
  return {
    base: customColor,
    hover: darken(customColor, 15),
    active: darken(customColor, 30)
  };
}

// Helper Utilities
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}
