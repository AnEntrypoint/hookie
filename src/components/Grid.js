const Grid = ({
  columns = 2,
  gap = 'md',
  minItemWidth = '280px',
  autoFit = false,
  autoFill = false,
  align = 'stretch',
  justify = 'stretch',
  autoFlow = 'row',
  children,
  style = {}
} = {}) => {
  const gapPresets = {
    sm: '12px',
    md: '20px',
    lg: '32px',
    xl: '48px'
  };

  const getGapValue = (gapProp) => {
    return gapPresets[gapProp] || gapProp || gapPresets.md;
  };

  const getGridTemplateColumns = () => {
    if (autoFit) {
      return `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;
    }
    if (autoFill) {
      return `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`;
    }
    return `repeat(${columns}, 1fr)`;
  };

  const getAutoFlow = () => {
    if (autoFlow === 'dense') {
      return 'row dense';
    }
    if (autoFlow === 'column') {
      return 'column';
    }
    return 'row';
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: getGridTemplateColumns(),
    gridAutoRows: 'auto',
    gap: getGapValue(gap),
    alignItems: align,
    justifyItems: justify,
    gridAutoFlow: getAutoFlow(),
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    ...style
  };

  return (
    <div className="grid" style={containerStyle}>
      {children}
    </div>
  );
};

export default Grid;
