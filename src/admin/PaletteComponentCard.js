import React from 'react';
import { useDrag } from 'react-dnd';
import componentRegistry from '../lib/componentRegistry';
import { getComponentTypeInfo } from './PaletteTreeNode';
import { styles } from './componentPaletteStyles';

const CATEGORY_LABELS = {
  Container: 'Layout', Section: 'Layout', Grid: 'Layout',
  Heading: 'Content', Text: 'Content', Image: 'Content', List: 'Content',
  Button: 'Interactive', Link: 'Interactive',
  Card: 'Display', AlertBox: 'Display', Divider: 'Display',
};

function getCategoryLabel(name) {
  return CATEGORY_LABELS[name] || 'Custom';
}

function ComponentPreview({ type }) {
  const previews = {
    Button: <button style={{ padding: '8px 12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500' }}>Click</button>,
    Text: <p style={{ margin: 0, fontSize: '0.75rem', color: '#1e293b' }}>Sample text</p>,
    Heading: <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>Heading</h3>,
    Link: <a style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none' }} href="#">Link</a>,
    Image: <div style={styles.previewPlaceholder}><span style={styles.previewIcon}>IMG</span></div>,
    Container: <div style={styles.previewBox} />,
    Section: <div style={styles.previewBox} />,
    Grid: <div style={styles.previewBox} />,
    Divider: <div style={styles.previewDivider} />,
    List: <ul style={styles.previewList}><li style={styles.previewListItem} /><li style={styles.previewListItem} /></ul>,
  };

  return (
    <div style={styles.previewContainer}>
      {previews[type] || <div style={styles.previewPlaceholder}><span style={styles.previewIcon}>?</span></div>}
    </div>
  );
}

export { getCategoryLabel };

export default function PaletteComponentCard({ type, isMobile, isTablet, dragLongPressed, setDragLongPressed }) {
  const [pressTimer, setPressTimer] = React.useState(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { componentType: type },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const handleMouseDown = () => {
    if (isMobile) {
      const timer = setTimeout(() => setDragLongPressed(type), 500);
      setPressTimer(timer);
    }
  };

  const handleMouseUp = () => {
    if (pressTimer) { clearTimeout(pressTimer); setPressTimer(null); }
  };

  const schema = componentRegistry.getComponent(type);
  const description = schema?.description || 'No description';
  const props = schema?.props ? Object.keys(schema.props).slice(0, 4) : [];
  const categoryLabel = getCategoryLabel(type);
  const typeInfo = getComponentTypeInfo(type);

  const cardStyle = isMobile
    ? { ...styles.card, ...styles.cardMobile, opacity: isDragging || dragLongPressed === type ? 0.7 : 1 }
    : isTablet
    ? { ...styles.card, ...styles.cardTablet, opacity: isDragging ? 0.7 : 1 }
    : { ...styles.card, opacity: isDragging ? 0.7 : 1 };

  return (
    <div ref={drag} style={cardStyle} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}>
      <div style={isMobile ? styles.cardPreviewMobile : styles.cardPreview}>
        {isMobile ? (
          <div style={styles.mobileIconContainer}>
            <span style={styles.mobileIcon}>{typeInfo.icon}</span>
            <span style={styles.mobileLabel}>{type.slice(0, 3)}</span>
          </div>
        ) : (
          <ComponentPreview type={type} />
        )}
      </div>
      {!isMobile && (
        <div style={styles.cardInfo}>
          <div style={styles.cardHeader}>
            <div style={styles.cardName}>{type}</div>
            <div style={styles.componentType}>{categoryLabel}</div>
          </div>
          <div style={styles.cardDescription}>{description}</div>
          {props.length > 0 && <div style={styles.cardProps}>Props: {props.join(', ')}</div>}
        </div>
      )}
    </div>
  );
}
