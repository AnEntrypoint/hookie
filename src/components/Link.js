import React, { useState } from 'react';

const Link = ({
  href = '#',
  text = 'Link',
  variant = 'default',
  color = 'primary',
  customColor,
  size = 'md',
  newTab = false,
  underline = false,
  style = {}
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const colorMap = {
    primary: {
      default: '#2563eb',
      hover: '#1e40af',
      active: '#1e3a8a'
    },
    success: {
      default: '#10b981',
      hover: '#059669',
      active: '#047857'
    },
    danger: {
      default: '#ef4444',
      hover: '#dc2626',
      active: '#991b1b'
    },
    muted: {
      default: '#64748b',
      hover: '#475569',
      active: '#1e293b'
    }
  };

  const sizeMap = {
    sm: {
      fontSize: '0.875rem',
      height: '32px'
    },
    md: {
      fontSize: '1rem',
      height: '40px'
    },
    lg: {
      fontSize: '1.125rem',
      height: '48px'
    }
  };

  const buttonPaddingMap = {
    sm: '8px 16px',
    md: '10px 20px',
    lg: '12px 24px'
  };

  const currentColor = customColor || colorMap[color].default;
  const hoverColor = customColor || colorMap[color].hover;
  const activeColor = customColor || colorMap[color].active;

  const getDefaultVariantStyles = () => ({
    color: isActive ? activeColor : isHovered ? hoverColor : currentColor,
    textDecoration: isHovered ? 'solid' : 'none',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    borderBottom: `2px solid ${isHovered || underline ? (isActive ? activeColor : hoverColor) : 'transparent'}`,
    transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
    display: 'inline-block'
  });

  const getUnderlineVariantStyles = () => ({
    color: isActive ? activeColor : isHovered ? hoverColor : currentColor,
    textDecoration: 'underline',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'color 150ms ease-in-out',
    display: 'inline-block',
    filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
  });

  const getButtonVariantStyles = () => {
    const baseShadowColor = color === 'primary' ? 'rgba(37, 99, 235, 0.3)' :
                           color === 'success' ? 'rgba(16, 185, 129, 0.3)' :
                           color === 'danger' ? 'rgba(239, 68, 68, 0.3)' :
                           'rgba(100, 116, 139, 0.3)';

    return {
      background: isActive ? activeColor : isHovered ? hoverColor : currentColor,
      color: '#ffffff',
      padding: buttonPaddingMap[size],
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isActive ? `0 2px 8px ${baseShadowColor}` : isHovered ? `0 8px 24px ${baseShadowColor}` : `0 2px 8px ${baseShadowColor}`,
      transform: isActive ? 'translateY(0)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
      display: 'inline-block',
      height: sizeMap[size].height,
      lineHeight: sizeMap[size].height,
      textAlign: 'center',
      whiteSpace: 'nowrap'
    };
  };

  const getPillVariantStyles = () => {
    const pillBg = `${currentColor}33`;
    const pillBgHover = currentColor;

    return {
      background: isHovered ? pillBgHover : pillBg,
      color: isHovered ? '#ffffff' : currentColor,
      padding: buttonPaddingMap[size],
      borderRadius: '9999px',
      border: `2px solid ${currentColor}`,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      display: 'inline-block',
      height: sizeMap[size].height,
      lineHeight: sizeMap[size].height,
      textAlign: 'center',
      whiteSpace: 'nowrap'
    };
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'underline':
        return getUnderlineVariantStyles();
      case 'button':
        return getButtonVariantStyles();
      case 'pill':
        return getPillVariantStyles();
      default:
        return getDefaultVariantStyles();
    }
  };

  const getFocusStyles = () => {
    const focusColorMap = {
      primary: 'rgba(37, 99, 235, 0.5)',
      success: 'rgba(16, 185, 129, 0.4)',
      danger: 'rgba(239, 68, 68, 0.4)',
      muted: 'rgba(100, 116, 139, 0.4)'
    };

    return {
      outline: `3px solid ${focusColorMap[color] || focusColorMap.primary}`,
      outlineOffset: '2px'
    };
  };

  const linkStyle = {
    ...getVariantStyles(),
    ...sizeMap[size],
    ...style
  };

  const externalIcon = newTab && text ? (
    <span style={{
      marginLeft: '4px',
      display: 'inline-block',
      fontSize: '0.75em',
      verticalAlign: 'middle'
    }}>
      ↗
    </span>
  ) : null;

  const isExternal = newTab;

  return (
    <a
      href={href}
      className="link"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      style={linkStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onFocus={(e) => {
        e.target.style.outline = getFocusStyles().outline;
        e.target.style.outlineOffset = getFocusStyles().outlineOffset;
      }}
      onBlur={(e) => {
        e.target.style.outline = 'none';
      }}
    >
      {text}
      {externalIcon}
    </a>
  );
};

export default Link;
