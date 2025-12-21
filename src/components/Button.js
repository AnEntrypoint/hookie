import React, { useState } from 'react';

const Button = ({
  label = 'Click me',
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  style = {}
}) => {
  const [isActive, setIsActive] = useState(false);

  const sizeStyles = {
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

  const variantBaseStyles = {
    primary: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontWeight: 700,
      letterSpacing: '0.4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
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
      cursor: disabled ? 'not-allowed' : 'pointer',
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
      cursor: disabled ? 'not-allowed' : 'pointer',
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
      cursor: disabled ? 'not-allowed' : 'pointer',
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
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
      userSelect: 'none'
    }
  };

  const getVariantStyles = () => {
    const baseStyle = variantBaseStyles[variant] || variantBaseStyles.primary;
    
    if (disabled) {
      if (variant === 'primary' || variant === 'success') {
        return {
          ...baseStyle,
          background: '#cbd5e1',
          opacity: 0.6,
          boxShadow: 'none'
        };
      } else if (variant === 'secondary') {
        return {
          ...baseStyle,
          background: '#f1f5f9',
          color: '#cbd5e1',
          borderColor: '#e2e8f0',
          opacity: 0.6
        };
      } else if (variant === 'danger') {
        return {
          ...baseStyle,
          color: '#fecaca',
          borderColor: '#fecaca',
          opacity: 0.6
        };
      } else if (variant === 'ghost') {
        return {
          ...baseStyle,
          color: '#cbd5e1',
          opacity: 0.6
        };
      }
    }

    return baseStyle;
  };

  const getFocusStyles = () => {
    const focusOutlineMap = {
      primary: '3px solid rgba(37, 99, 235, 0.5)',
      secondary: '3px solid rgba(37, 99, 235, 0.4)',
      danger: '3px solid rgba(220, 38, 38, 0.4)',
      ghost: '2px solid #2563eb',
      success: '3px solid rgba(16, 185, 129, 0.4)'
    };
    
    return {
      outline: focusOutlineMap[variant] || focusOutlineMap.primary,
      outlineOffset: '2px'
    };
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsActive(true);
    }
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  const getHoverActiveStyles = () => {
    if (disabled) return {};

    const hoverActiveMap = {
      primary: {
        hover: {
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
          transform: 'translateY(-2px)',
          filter: 'brightness(1.08)'
        },
        active: {
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e3a8a 100%)',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
          transform: 'translateY(0)'
        }
      },
      secondary: {
        hover: {
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
          borderColor: '#94a3b8',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)'
        },
        active: {
          background: 'linear-gradient(135deg, #cbd5e1 0%, #cbd5e1 100%)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          transform: 'translateY(0)'
        }
      },
      danger: {
        hover: {
          background: 'rgba(220, 38, 38, 0.08)',
          borderColor: '#b91c1c',
          boxShadow: '0 6px 20px rgba(220, 38, 38, 0.3)',
          transform: 'translateY(-2px)'
        },
        active: {
          background: 'rgba(220, 38, 38, 0.15)',
          borderColor: '#991b1b',
          boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
          transform: 'translateY(0)'
        }
      },
      ghost: {
        hover: {
          background: '#f1f5f9',
          color: '#1e293b',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        },
        active: {
          background: '#e2e8f0',
          color: '#0f172a'
        }
      },
      success: {
        hover: {
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
          transform: 'translateY(-2px)'
        },
        active: {
          background: 'linear-gradient(135deg, #047857 0%, #047857 100%)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
          transform: 'translateY(0)'
        }
      }
    };

    return hoverActiveMap[variant] || hoverActiveMap.primary;
  };

  const hoverActiveStyles = getHoverActiveStyles();
  const currentStateStyles = isActive ? hoverActiveStyles.active || {} : {};

  const buttonStyle = {
    ...getVariantStyles(),
    ...sizeStyles[size],
    width: fullWidth ? '100%' : 'auto',
    display: fullWidth ? 'block' : 'inline-block',
    ...currentStateStyles,
    ...style
  };

  const handleClick = (e) => {
    if (!disabled && typeof onClick === 'function') {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled}
      onFocus={(e) => {
        e.target.style.outline = getFocusStyles().outline;
        e.target.style.outlineOffset = getFocusStyles().outlineOffset;
      }}
      onBlur={(e) => {
        e.target.style.outline = 'none';
      }}
    >
      {label}
    </button>
  );
};

export default Button;
