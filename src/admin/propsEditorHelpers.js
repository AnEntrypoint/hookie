// propsEditorHelpers.js
// Pure utility functions for PropsEditor component
// Handles type coercion, validation, and color detection

/**
 * Default color palette for the admin interface
 */
export const DEFAULT_COLORS = {
  primary: '#2563eb',
  primaryDark: '#1e40af',
  primaryLight: '#dbeafe',
  success: '#10b981',
  successLight: '#d1fae5',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  lightBg: '#f8fafc',
  subtleBg: '#f1f5f9',
  border: '#e2e8f0',
  borderDark: '#cbd5e1',
  textDark: '#1e293b',
  textLight: '#64748b',
  textMuted: '#94a3b8',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
};

/**
 * Detects if a prop name suggests it should use a color picker
 * @param {string} propName - Name of the prop to check
 * @returns {boolean} True if prop appears to be a color value
 */
export const isColorProp = (propName) => {
  const lowerName = propName.toLowerCase();
  return lowerName.includes('color') || lowerName.includes('background');
};

/**
 * Coerces a value to the appropriate type based on schema type
 * @param {any} value - Value to coerce
 * @param {string} type - Target type (string/number/boolean/array/object)
 * @returns {any} Coerced value
 */
export const coerceValue = (value, type) => {
  switch (type) {
    case 'number':
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value === 'true';
      return Boolean(value);
    
    case 'array':
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    
    case 'object':
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch {
          return {};
        }
      }
      return {};
    
    default:
      return value;
  }
};

/**
 * Validates JSON string for array or object types
 * @param {string} value - JSON string to validate
 * @param {string} type - Expected type (array/object)
 * @returns {string|null} Error message or null if valid
 */
export const validateJSON = (value, type) => {
  if (type === 'array' || type === 'object') {
    try {
      JSON.parse(value);
      return null;
    } catch (e) {
      return `Invalid JSON: ${e.message}`;
    }
  }
  return null;
};

/**
 * Validates color value format (hex, rgb, hsl)
 * @param {string} value - Color value to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateColorValue = (value) => {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i;
  const hslRegex = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i;
  
  if (hexRegex.test(value) || rgbRegex.test(value) || hslRegex.test(value)) {
    return null;
  }
  return 'Invalid color format';
};
