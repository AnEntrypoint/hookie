import React, { useState } from 'react';

/**
 * Link Component
 * Beautiful hyperlink component with elegant styling, hover effects, and accessibility support.
 *
 * @param {Object} props - Component props
 * @param {string} props.href - URL or anchor link (default: '#')
 * @param {string} props.text - Link text to display (default: 'Link')
 * @param {string} props.color - Link color (default: '#2563eb')
 * @param {boolean} props.underline - Show underline by default (default: false)
 * @param {boolean} props.newTab - Open in new tab (default: false)
 * @param {Object} props.style - Additional inline styles to merge
 * @returns {JSX.Element} A styled anchor element
 */
const Link = ({
  href = '#',
  text = 'Link',
  color = '#2563eb',
  underline = false,
  newTab = false,
  style = {}
}) => {
  // State for hover and active states
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Color definitions for different states
  const colorMap = {
    default: color,
    hover: '#1e40af',
    active: '#1e3a8a'
  };

  // Calculate current color based on state
  const currentColor = isActive ? colorMap.active : isHovered ? colorMap.hover : colorMap.default;

  // Calculate border-bottom based on state
  const borderBottom = isActive || isHovered ? `2px solid ${currentColor}` : '2px solid transparent';

  // Base styles for the link
  const baseStyles = {
    color: currentColor,
    textDecoration: underline && !isHovered ? 'underline' : isHovered ? 'underline' : 'none',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 150ms ease-in-out',
    borderBottom,
    position: 'relative',
    display: 'inline-block',
    padding: '2px 0',
    transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
    ...(isFocused && {
      outline: '3px solid rgba(37, 99, 235, 0.4)',
      outlineOffset: '2px',
      outlineStyle: 'solid',
      boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)'
    })
  };

  // Merge with user-provided styles
  const mergedStyles = {
    ...baseStyles,
    ...style
  };

  return (
    <a
      href={href}
      className="link"
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      style={mergedStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {text}
    </a>
  );
};

export default Link;