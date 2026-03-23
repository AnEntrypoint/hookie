import React from 'react';
import { useDrag } from 'react-dnd';
import componentRegistry from '../lib/componentRegistry';
import { getComponentTypeInfo } from './PaletteTreeNode';
import { styles } from './componentPaletteStyles';

function getCategoryLabel(name) {
  const schema = componentRegistry.getComponent(name);
  return schema?.category || 'Custom';
}

function ComponentPreview({ type }) {
  const previews = {
    Button: <button style={{ padding: '8px 12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500' }}>Click</button>,
    Text: <p style={{ margin: 0, fontSize: '0.75rem', color: '#1e293b' }}>Sample text</p>,
    Heading: <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>Heading</h3>,
    Link: <a style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none' }} href="#">Link</a>,
    Image: <div style={{ width: '48px', height: '36px', background: 'linear-gradient(135deg, #bfdbfe, #c7d2fe)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🖼</div>,
    Container: <div style={{ width: '48px', height: '36px', border: '2px dashed #94a3b8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '28px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} /></div>,
    Section: <div style={{ width: '52px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '2px', boxShadow: '0 4px 0 #cbd5e1, 0 8px 0 #e2e8f0' }} />,
    Grid: <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', width: '40px' }}>{[0,1,2,3].map(i => <div key={i} style={{ height: '16px', backgroundColor: '#bfdbfe', borderRadius: '2px' }} />)}</div>,
    Divider: <div style={styles.previewDivider} />,
    List: <ul style={styles.previewList}><li style={styles.previewListItem} /><li style={styles.previewListItem} /><li style={{ ...styles.previewListItem, width: '36px' }} /></ul>,
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
