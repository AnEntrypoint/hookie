import React from 'react';

/**
 * Helper function to get font weight value
 * @param {string} weight - Weight string: 'normal'|'semibold'|'bold'
 * @returns {number} Font weight value
 */
function getWeight(weight) {
  const weights = {
    'normal': 400,
    'semibold': 600,
    'bold': 700,
  };
  return weights[weight] || 700;
}

/**
 * Helper function to get level-specific typography styles
 * @param {number} level - Heading level (1-6)
 * @returns {object} Typography styles object
 */
function getLevelStyles(level) {
  const styles = {
    1: {
      fontSize: '3rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.8px',
      textShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
    },
    3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.2px',
    },
    4: {
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0px',
    },
    5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.2px',
    },
    6: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.6,
      letterSpacing: '0.3px',
    },
  };

  return styles[level] || styles[1];
}

/**
 * Heading Component
 * Semantic heading element with beautiful typography and responsive scaling.
 * Supports heading levels 1-6 with proper typography hierarchy.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} [props.level=1] - Heading level (1-6, clamped to valid range)
 * @param {string} [props.text='Heading'] - Heading text content
 * @param {string} [props.color='#1e293b'] - CSS color value
 * @param {string} [props.align='left'] - Text alignment ('left'|'center'|'right')
 * @param {string} [props.weight='bold'] - Font weight ('normal'|'semibold'|'bold')
 * @param {Object} [props.style={}] - Additional inline styles to merge
 * @returns {React.ReactElement} Rendered heading element
 */
function Heading({
  level = 1,
  text = 'Heading',
  color = '#1e293b',
  align = 'left',
  weight = 'bold',
  style = {},
}) {
  // Clamp level to valid range (1-6)
  const clampedLevel = Math.max(1, Math.min(6, parseInt(level) || 1));

  // Get level-specific styles
  const levelStyles = getLevelStyles(clampedLevel);

  // Merge all styles
  const mergedStyles = {
    ...levelStyles,
    color,
    textAlign: align,
    fontWeight: getWeight(weight),
    marginBottom: '16px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    ...style,
  };

  // Create the appropriate heading element
  const HeadingElement = `h${clampedLevel}`;

  return React.createElement(
    HeadingElement,
    {
      className: `heading heading-${clampedLevel}`,
      style: mergedStyles,
    },
    text
  );
}

Heading.propTypes = {
  level: function(props) {
    const level = props.level;
    if (level !== undefined && (typeof level !== 'number' || level < 1 || level > 6)) {
      return new Error('level must be a number between 1 and 6');
    }
    return null;
  },
  text: function(props) {
    const text = props.text;
    if (text !== undefined && typeof text !== 'string') {
      return new Error('text must be a string');
    }
    return null;
  },
  color: function(props) {
    const color = props.color;
    if (color !== undefined && typeof color !== 'string') {
      return new Error('color must be a string');
    }
    return null;
  },
  align: function(props) {
    const align = props.align;
    if (align !== undefined && !['left', 'center', 'right'].includes(align)) {
      return new Error("align must be 'left', 'center', or 'right'");
    }
    return null;
  },
  weight: function(props) {
    const weight = props.weight;
    if (weight !== undefined && !['normal', 'semibold', 'bold'].includes(weight)) {
      return new Error("weight must be 'normal', 'semibold', or 'bold'");
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

export default Heading;
