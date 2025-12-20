import React, { useState } from 'react';

/**
 * Helper function to get border-radius value
 * @param {string} borderRadius - Border radius variant: 'sm'|'md'|'lg'|'full'
 * @returns {string} Border radius CSS value in pixels
 */
function getBorderRadius(borderRadius) {
  const radiusMap = {
    'sm': '6px',
    'md': '12px',
    'lg': '16px',
    'full': '9999px',
  };
  return radiusMap[borderRadius] || '12px';
}

/**
 * Image Component
 * Responsive image component with elegant styling, lazy loading support, and accessibility features.
 * Displays images with configurable dimensions, styling, hover effects, and optional lazy loading.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL (required)
 * @param {string} [props.alt='Image'] - Alternative text for accessibility
 * @param {string} [props.width='auto'] - CSS width value
 * @param {string} [props.height='auto'] - CSS height value
 * @param {string} [props.borderRadius='md'] - Border radius variant ('sm'|'md'|'lg'|'full')
 * @param {string} [props.objectFit='cover'] - CSS object-fit value ('cover'|'contain'|'fill')
 * @param {boolean} [props.lazy=true] - Enable lazy loading
 * @param {Object} [props.style={}] - Additional inline styles to merge
 * @returns {React.ReactElement} Rendered image element
 */
function Image({
  src,
  alt = 'Image',
  width = 'auto',
  height = 'auto',
  borderRadius = 'md',
  objectFit = 'cover',
  lazy = true,
  style = {},
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Base styles for the image
  const baseStyles = {
    display: 'block',
    width,
    height,
    maxWidth: '100%',
    borderRadius: getBorderRadius(borderRadius),
    objectFit,
    boxShadow: isHovered
      ? '0 12px 24px rgba(0, 0, 0, 0.15)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: isHovered
      ? 'scale(1.03) translateY(-4px)'
      : 'scale(1) translateY(0)',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  };

  // Merge all styles
  const mergedStyles = {
    ...baseStyles,
    ...style,
  };

  return (
    <img
      className="image"
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={mergedStyles}
    />
  );
}

/**
 * Prop validation for Image component
 */
Image.propTypes = {
  src: function(props) {
    const src = props.src;
    if (src !== undefined && typeof src !== 'string') {
      return new Error('src must be a string');
    }
    if (!src) {
      return new Error('src is required');
    }
    return null;
  },
  alt: function(props) {
    const alt = props.alt;
    if (alt !== undefined && typeof alt !== 'string') {
      return new Error('alt must be a string');
    }
    return null;
  },
  width: function(props) {
    const width = props.width;
    if (width !== undefined && typeof width !== 'string') {
      return new Error('width must be a string (CSS value)');
    }
    return null;
  },
  height: function(props) {
    const height = props.height;
    if (height !== undefined && typeof height !== 'string') {
      return new Error('height must be a string (CSS value)');
    }
    return null;
  },
  borderRadius: function(props) {
    const borderRadius = props.borderRadius;
    if (borderRadius !== undefined && !['sm', 'md', 'lg', 'full'].includes(borderRadius)) {
      return new Error("borderRadius must be 'sm', 'md', 'lg', or 'full'");
    }
    return null;
  },
  objectFit: function(props) {
    const objectFit = props.objectFit;
    if (objectFit !== undefined && !['cover', 'contain', 'fill'].includes(objectFit)) {
      return new Error("objectFit must be 'cover', 'contain', or 'fill'");
    }
    return null;
  },
  lazy: function(props) {
    const lazy = props.lazy;
    if (lazy !== undefined && typeof lazy !== 'boolean') {
      return new Error('lazy must be a boolean');
    }
    return null;
  },
  style: function(props) {
    const styleObj = props.style;
    if (styleObj !== undefined && typeof styleObj !== 'object') {
      return new Error('style must be an object');
    }
    return null;
  },
};

export default Image;
