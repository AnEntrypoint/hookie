import React from 'react';

const Card = ({
  title = '',
  description = '',
  imageUrl = '',
  imageAlt = '',
  accentColor = '#007bff',
  backgroundColor = '#ffffff',
  padding = '20px',
  borderRadius = '8px',
  shadowSize = 'medium',
  style = {}
}) => {
  const shadowStyles = {
    small: '0 1px 3px rgba(0, 0, 0, 0.12)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 25px rgba(0, 0, 0, 0.15)'
  };

  const cardStyle = {
    backgroundColor,
    borderRadius,
    padding,
    boxShadow: shadowStyles[shadowSize] || shadowStyles.medium,
    border: `2px solid ${accentColor}`,
    transition: 'transform 200ms ease, box-shadow 200ms ease',
    cursor: 'pointer',
    ...style
  };

  return (
    <div style={cardStyle}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAlt || title}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: borderRadius,
            marginBottom: '16px',
            display: 'block',
            objectFit: 'cover'
          }}
        />
      )}

      {title && (
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: accentColor
        }}>
          {title}
        </h3>
      )}

      {description && (
        <p style={{
          margin: '0',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#555'
        }}>
          {description}
        </p>
      )}
    </div>
  );
};

export default Card;
