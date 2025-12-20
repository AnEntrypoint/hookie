import React, { useState } from 'react';

const List = (props) => {
  const {
    type = 'ul',
    items = ['Item 1', 'Item 2', 'Item 3'],
    color = '#1e293b',
    spacing = 'md',
    style: customStyle = {}
  } = props;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Helper function to get spacing values based on spacing prop
  const getSpacing = (spacingProp) => {
    const spacingMap = {
      sm: '6px 0',
      md: '12px 0',
      lg: '16px 0'
    };
    return spacingMap[spacingProp] || spacingMap.md;
  };

  // System font stack from global design system
  const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif";

  // Container styles for both ul and ol elements
  const containerStyle = {
    fontFamily: fontFamily,
    color: color,
    lineHeight: 1.9,
    margin: 0,
    paddingLeft: 28,
    listStylePosition: 'outside',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    ...customStyle
  };

  // Render list items
  const renderItems = () => {
    return items.map((item, index) => (
      <li
        key={index}
        style={{
          padding: getSpacing(spacing),
          color: hoveredIndex === index ? '#1e40af' : 'inherit',
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '0.2px',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hoveredIndex === index ? 'scale(1.01)' : 'scale(1)',
          cursor: 'default'
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {item}
      </li>
    ));
  };

  // Create the list element based on type prop
  const ListElement = type === 'ol' ? 'ol' : 'ul';

  return (
    <ListElement style={containerStyle}>
      {renderItems()}
    </ListElement>
  );
};

export default List;