import React, { useState } from 'react';
import * as linkStyles from './linkStyles.js';

export default function Link({
  href = '#',
  text = 'Link',
  variant = 'default',
  color = 'primary',
  customColor,
  size = 'md',
  newTab = false,
  style = {}
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsActive(false);
  };
  const handleMouseDown = () => setIsActive(true);
  const handleMouseUp = () => setIsActive(false);

  function getComposedStyles() {
    const {
      baseStyles,
      defaultVariantStyles,
      underlineVariantStyles,
      getButtonVariantStyles,
      getPillVariantStyles,
      getSizeStyles,
      getDefaultVariantHoverStyles,
      getUnderlineVariantHoverStyles,
      getButtonVariantHoverStyles,
      getPillVariantHoverStyles,
      getButtonVariantActiveStyles,
      COLORS,
      getCustomColorStyles,
      hexToRgb
    } = linkStyles;
    
    const colorKey = customColor ? null : color;
    const customColorObj = customColor ? getCustomColorStyles(customColor) : null;
    const finalColor = customColorObj?.base || COLORS[colorKey]?.base || COLORS.primary.base;
    
    let styles = { ...baseStyles };

    if (variant === 'default') {
      styles = { ...styles, ...defaultVariantStyles, color: finalColor };
    } else if (variant === 'underline') {
      styles = { ...styles, ...underlineVariantStyles, color: finalColor };
    } else if (variant === 'button') {
      styles = { ...styles, ...getButtonVariantStyles(colorKey || 'primary', size) };
      if (customColor) {
        styles.backgroundColor = finalColor;
      }
    } else if (variant === 'pill') {
      styles = { ...styles, ...getPillVariantStyles(colorKey || 'primary', size) };
      if (customColor) {
        styles.backgroundColor = `rgba(${hexToRgb(finalColor)}, 0.1)`;
        styles.color = finalColor;
        styles.borderColor = finalColor;
      }
    }
    
    styles = { ...styles, ...getSizeStyles(size) };

    if (isHovered) {
      if (variant === 'default') {
        styles = { ...styles, ...getDefaultVariantHoverStyles(colorKey || 'primary') };
        if (customColor) {
          styles.color = customColorObj.hover;
          styles.borderBottomColor = customColorObj.hover;
        }
      } else if (variant === 'underline') {
        styles = { ...styles, ...getUnderlineVariantHoverStyles(colorKey || 'primary') };
        if (customColor) {
          styles.color = customColorObj.hover;
        }
      } else if (variant === 'button') {
        styles = { ...styles, ...getButtonVariantHoverStyles(colorKey || 'primary') };
        if (customColor) {
          styles.backgroundColor = customColorObj.hover;
        }
      } else if (variant === 'pill') {
        styles = { ...styles, ...getPillVariantHoverStyles(colorKey || 'primary') };
        if (customColor) {
          styles.backgroundColor = finalColor;
        }
      }
    }
    
    if (isActive && (variant === 'button' || variant === 'pill')) {
      if (variant === 'button') {
        styles = { ...styles, ...getButtonVariantActiveStyles(colorKey || 'primary') };
        if (customColor) {
          styles.backgroundColor = customColorObj.active;
        }
      }
    }
    
    return { ...styles, ...style };
  }

  const externalAttrs = newTab ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {};

  return (
    <a
      href={href || '#'}
      style={getComposedStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...externalAttrs}
    >
      {text || 'Link'}
    </a>
  );
}
