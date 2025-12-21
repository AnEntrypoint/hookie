const getBorderRadius = (variant = 'md') => {
  const radii = {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px'
  };
  return radii[variant] || radii.md;
};

const getShadow = (variant = 'md') => {
  const shadows = {
    none: 'none',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.25)'
  };
  return shadows[variant] || shadows.md;
};

const getHoverEffect = (effect = 'lift', baseShadow) => {
  const hoverShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
  
  switch (effect) {
    case 'lift':
      return {
        boxShadow: hoverShadow,
        transform: 'translateY(-6px)'
      };
    case 'zoom':
      return {
        boxShadow: hoverShadow,
        transform: 'scale(1.05)'
      };
    case 'glow':
      return {
        boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)',
        transform: 'scale(1.02)'
      };
    case 'none':
    default:
      return {};
  }
};

export default function Image({
  src,
  alt = 'Image',
  width = 'auto',
  height = 'auto',
  borderRadius = 'md',
  objectFit = 'cover',
  objectPosition = 'center',
  lazy = true,
  shadow = 'md',
  effect = 'lift',
  style = {}
}) {
  const baseShadow = getShadow(shadow);
  const hoverEffect = getHoverEffect(effect, baseShadow);

  const baseStyles = {
    display: 'block',
    width,
    height,
    maxWidth: '100%',
    borderRadius: getBorderRadius(borderRadius),
    objectFit,
    objectPosition,
    boxShadow: baseShadow,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    userSelect: 'none',
    cursor: effect !== 'none' ? 'pointer' : 'default'
  };

  const mergedStyles = { ...baseStyles, ...style };

  return (
    <img
      className="image"
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      style={mergedStyles}
      onMouseEnter={(e) => {
        if (effect !== 'none') {
          Object.assign(e.currentTarget.style, hoverEffect);
        }
      }}
      onMouseLeave={(e) => {
        if (effect !== 'none') {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = baseShadow;
        }
      }}
    />
  );
}
