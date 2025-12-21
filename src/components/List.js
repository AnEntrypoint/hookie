import React, { useState } from 'react';

const List = ({
  type = 'ul',
  items = ['Item 1', 'Item 2', 'Item 3'],
  color = '#1e293b',
  spacing = 'md',
  bulletStyle = 'disc',
  numberStyle = 'decimal',
  style = {}
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getSpacing = (spacingProp) => {
    const spacingMap = {
      sm: '8px 0',
      md: '12px 0',
      lg: '16px 0',
      xl: '20px 0'
    };
    return spacingMap[spacingProp] || spacingMap.md;
  };

  const getColorValue = (colorProp) => {
    const colorMap = {
      default: '#1e293b',
      primary: '#2563eb',
      success: '#10b981',
      danger: '#ef4444',
      muted: '#64748b'
    };
    return colorMap[colorProp] || colorProp;
  };

  const getDarkerColor = (baseColor) => {
    const darkerMap = {
      '#1e293b': '#0f172a',
      '#2563eb': '#1e40af',
      '#10b981': '#059669',
      '#ef4444': '#dc2626',
      '#64748b': '#475569'
    };
    return darkerMap[baseColor] || baseColor;
  };

  const getBulletStyle = (bulletStyleProp) => {
    const bulletMap = {
      disc: 'disc',
      circle: 'circle',
      square: 'square',
      check: '✓',
      arrow: '→',
      dot: '•'
    };
    return bulletMap[bulletStyleProp] || bulletMap.disc;
  };

  const getNumberStyle = (numberStyleProp) => {
    const numberMap = {
      decimal: 'decimal',
      roman: 'lower-roman',
      alpha: 'lower-alpha',
      custom: 'decimal'
    };
    return numberMap[numberStyleProp] || numberMap.decimal;
  };

  const resolvedColor = getColorValue(color);
  const darkerColor = getDarkerColor(resolvedColor);
  const resolvedBulletStyle = getBulletStyle(bulletStyle);
  const resolvedNumberStyle = getNumberStyle(numberStyle);

  const isBulletCustom = ['check', 'arrow', 'dot'].includes(bulletStyle);
  const isNumberCustom = numberStyle === 'custom';

  const containerStyle = {
    color: resolvedColor,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    lineHeight: 1.7,
    margin: 0,
    paddingLeft: 28,
    listStylePosition: 'outside',
    listStyleType: type === 'ul' && !isBulletCustom ? resolvedBulletStyle : (type === 'ol' && !isNumberCustom ? resolvedNumberStyle : 'none'),
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    ...style
  };

  const getListItemStyle = (index) => {
    const isHovered = hoveredIndex === index;
    return {
      padding: getSpacing(spacing),
      color: isHovered ? darkerColor : resolvedColor,
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0px',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
      cursor: 'default',
      userSelect: 'text'
    };
  };

  if (!items || items.length === 0) {
    return React.createElement(
      type === 'ol' ? 'ol' : 'ul',
      { style: containerStyle }
    );
  }

  const ListElement = type === 'ol' ? 'ol' : 'ul';

  if (isBulletCustom || isNumberCustom) {
    return React.createElement(
      ListElement,
      { style: containerStyle },
      items.map((item, index) => {
        let itemContent = item;
        
        if (isBulletCustom && type === 'ul') {
          itemContent = (
            <span style={{ userSelect: 'none' }}>
              <span style={{ marginRight: '8px', color: resolvedColor }}>{resolvedBulletStyle}</span>
              <span>{item}</span>
            </span>
          );
        } else if (isNumberCustom && type === 'ol') {
          itemContent = (
            <span style={{ userSelect: 'none' }}>
              <span style={{ marginRight: '8px', color: resolvedColor, fontWeight: 600 }}>{index + 1}.</span>
              <span>{item}</span>
            </span>
          );
        }

        return React.createElement(
          'li',
          {
            key: index,
            style: getListItemStyle(index),
            onMouseEnter: () => setHoveredIndex(index),
            onMouseLeave: () => setHoveredIndex(null)
          },
          itemContent
        );
      })
    );
  }

  return React.createElement(
    ListElement,
    { style: containerStyle },
    items.map((item, index) =>
      React.createElement(
        'li',
        {
          key: index,
          style: getListItemStyle(index),
          onMouseEnter: () => setHoveredIndex(index),
          onMouseLeave: () => setHoveredIndex(null)
        },
        item
      )
    )
  );
};

export default List;
