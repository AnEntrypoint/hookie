import React from 'react';

const levelStyles = {
  1: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '32px',
    marginTop: 0,
  },
  2: {
    fontSize: '2.5rem',
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
    marginBottom: '24px',
    marginTop: 0,
  },
  3: {
    fontSize: '1.875rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.3px',
    marginBottom: '20px',
    marginTop: 0,
  },
  4: {
    fontSize: '1.5rem',
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: '-0.1px',
    marginBottom: '16px',
    marginTop: 0,
  },
  5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0px',
    marginBottom: '12px',
    marginTop: 0,
  },
  6: {
    fontSize: '1.125rem',
    fontWeight: 700,
    lineHeight: 1.6,
    letterSpacing: '0.3px',
    marginBottom: '12px',
    marginTop: 0,
  },
};

const getWeight = (weight) => {
  const weights = {
    normal: 400,
    semibold: 600,
    bold: 700,
  };
  return weights[weight] || 700;
};

export default function Heading({
  level = 1,
  text = 'Heading',
  color = '#1e293b',
  align = 'left',
  weight = 'bold',
  style = {},
} = {}) {
  const clampedLevel = Math.max(1, Math.min(6, level));
  const HeadingTag = `h${clampedLevel}`;

  const headingStyle = {
    ...levelStyles[clampedLevel],
    color,
    textAlign: align,
    fontWeight: getWeight(weight),
    wordBreak: 'break-word',
    ...style,
  };

  return React.createElement(
    HeadingTag,
    {
      className: `heading heading-${clampedLevel}`,
      style: headingStyle,
    },
    text
  );
}