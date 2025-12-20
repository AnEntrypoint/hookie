import React from 'react';

/**
 * Grid Component
 *
 * Responsive CSS Grid layout for arranging content in columns with elegant spacing
 * and responsive behavior. Supports both fixed column counts and responsive auto-fit layouts.
 *
 * @component
 * @example
 * // Fixed 3-column grid with medium gap
 * <Grid columns={3} gap="md">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 *
 * @example
 * // Responsive auto-fit grid
 * <Grid autoFit minItemWidth="300px">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 */

/**
 * Helper function to resolve gap values
 * Converts gap presets (sm, md, lg) or custom CSS values to actual gap size
 *
 * @param {string} gapProp - Gap preset ('sm'|'md'|'lg') or custom CSS value
 * @returns {string} Resolved gap value in pixels or custom CSS
 */
const getGapValue = (gapProp) => {
  const gapPresets = {
    sm: '16px',  // compact spacing
    md: '24px',  // default spacing
    lg: '40px'   // generous spacing
  };

  // If gapProp matches a preset, use the preset value
  if (gapPresets[gapProp]) {
    return gapPresets[gapProp];
  }

  // Otherwise, treat it as a custom CSS value (e.g., '2rem', 'calc(1vw + 10px)')
  return gapProp || gapPresets.md;
};

/**
 * Grid functional component
 *
 * Provides a CSS Grid container with responsive column layout, customizable gaps,
 * and support for both fixed and auto-responsive grids.
 *
 * @param {Object} props - Component props
 * @param {number} [props.columns=2] - Number of grid columns (ignored when autoFit=true)
 * @param {string} [props.gap='md'] - Gap preset ('sm'|'md'|'lg') or custom CSS value
 * @param {string} [props.minItemWidth='250px'] - Minimum width for items in auto-fit mode
 * @param {boolean} [props.autoFit=false] - Enable responsive auto-fit layout
 * @param {React.ReactNode} [props.children] - Child components to render as grid items
 * @param {Object} [props.style] - Additional inline styles to merge with grid styles
 * @returns {React.ReactElement} Rendered grid container with children
 */
const Grid = ({
  columns = 2,
  gap = 'md',
  minItemWidth = '250px',
  autoFit = false,
  children,
  style
}) => {
  // Resolve the gap value (preset or custom CSS)
  const gapValue = getGapValue(gap);

  // Determine grid-template-columns based on autoFit prop
  const gridTemplateColumns = autoFit
    ? `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
    : `repeat(${columns}, 1fr)`;

  // Merge styles: grid styles + custom style prop
  const mergedStyles = {
    display: 'grid',
    gridTemplateColumns,
    gap: gapValue,
    gridAutoFlow: 'row',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    ...style
  };

  return (
    <div
      className="grid"
      style={mergedStyles}
    >
      {children}
    </div>
  );
};

export default Grid;