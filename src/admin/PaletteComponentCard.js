import React from 'react';
import { useDrag } from 'react-dnd';
import componentRegistry from '../lib/componentRegistry';
import { getComponentTypeInfo } from './PaletteTreeNode';

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
    Divider: <div style={{ width: '50px', height: '2px', backgroundColor: '#cbd5e1' }} />,
    List: <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}><li style={{ width: '50px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px' }} /><li style={{ width: '50px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px' }} /><li style={{ width: '36px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px' }} /></ul>,
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
      {previews[type] || <div style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '1.5rem' }}>?</span></div>}
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

  const baseCls = 'flex flex-col border border-gray-200 rounded-lg cursor-grab transition-all duration-150 bg-white';
  const cardCls = isMobile
    ? `${baseCls} min-h-0 max-h-none min-w-[60px] p-3 items-center justify-center gap-2`
    : isTablet
    ? `${baseCls} min-h-[80px] max-h-[100px] flex-row items-center gap-3`
    : `${baseCls} min-h-[200px] max-h-[250px] overflow-hidden`;

  return (
    <div ref={drag} className={cardCls} style={{ opacity: isDragging || dragLongPressed === type ? 0.7 : 1 }} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}>
      <div className={isMobile ? 'h-10 w-full bg-slate-50 rounded flex items-center justify-center overflow-hidden' : 'h-20 bg-slate-50 rounded-md mb-2 flex items-center justify-center overflow-hidden'}>
        {isMobile ? (
          <div className="flex flex-col items-center gap-1 w-full h-full justify-center">
            <span className="text-2xl block">{typeInfo.icon}</span>
            <span className="text-[0.65rem] font-semibold text-slate-800 text-center">{type.slice(0, 3)}</span>
          </div>
        ) : (
          <ComponentPreview type={type} />
        )}
      </div>
      {!isMobile && (
        <div className="flex flex-col gap-2 px-2 pb-2">
          <div className="flex items-center gap-2 justify-between">
            <div className="text-sm font-semibold text-slate-800">{type}</div>
            <div className="text-[0.6rem] font-bold text-blue-600 uppercase tracking-wide">{categoryLabel}</div>
          </div>
          <div className="text-xs text-slate-500 leading-tight">{description}</div>
          {props.length > 0 && <div className="text-[0.7rem] text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">Props: {props.join(', ')}</div>}
        </div>
      )}
    </div>
  );
}
