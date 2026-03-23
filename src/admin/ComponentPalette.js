import React, { useState, useMemo } from 'react';
import componentRegistry from '../lib/componentRegistry';
import PaletteComponentCard, { getCategoryLabel } from './PaletteComponentCard';
import PaletteTreeNode from './PaletteTreeNode';

const CATEGORY_ORDER = ['Layout', 'Content', 'Interactive', 'Display', 'Custom'];

function useResponsive() {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    return window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
  });

  React.useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setScreenSize(w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

export default function ComponentPalette({ pageData, selectedId, onSelect, onDelete, onDuplicate, isVisible, onToggleVisibility }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dragLongPressed, setDragLongPressed] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const screenSize = useResponsive();
  const allComponents = componentRegistry.getAllComponents();
  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';

  const filteredComponents = useMemo(() => {
    return allComponents.filter(name => {
      const schema = componentRegistry.getComponent(name);
      const description = schema?.description || '';
      const searchLower = searchTerm.toLowerCase();
      return name.toLowerCase().includes(searchLower) || description.toLowerCase().includes(searchLower);
    });
  }, [allComponents, searchTerm]);

  const categorized = useMemo(() => {
    const groups = {};
    filteredComponents.forEach(name => {
      const cat = getCategoryLabel(name);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(name);
    });
    return CATEGORY_ORDER
      .filter(cat => groups[cat]?.length)
      .map(cat => ({ name: cat, items: groups[cat] }))
      .concat(
        Object.keys(groups)
          .filter(cat => !CATEGORY_ORDER.includes(cat))
          .map(cat => ({ name: cat, items: groups[cat] }))
      );
  }, [filteredComponents]);

  const toggleCategory = (name) => {
    setCollapsedCategories(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const containerStyle = isMobile
    ? { position: 'fixed', bottom: 0, left: 0, right: 0, height: '40vh', maxHeight: 'calc(100vh - 200px)', borderRadius: '16px 16px 0 0', borderTop: '1px solid #e2e8f0', boxShadow: '0 -10px 25px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden', animation: 'slideUp 300ms cubic-bezier(0.4,0,0.2,1)', display: isVisible ? 'flex' : 'none', flexDirection: 'column', backgroundColor: '#ffffff' }
    : null;
  const containerCls = isMobile
    ? ''
    : isTablet ? 'flex flex-col gap-6 h-full overflow-y-auto bg-white w-[200px]'
    : 'flex flex-col gap-6 h-full overflow-y-auto bg-white';

  const paletteToggleStyle = { position: 'fixed', bottom: 'calc(40vh + 24px)', right: '24px', width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', zIndex: 45, transition: 'all 200ms ease', minHeight: '52px', minWidth: '52px' };
  const closeButtonStyle = { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '1.5rem', color: '#1e293b', cursor: 'pointer', padding: '4px 8px' };
  const clearSearchButtonStyle = { position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#ef4444', fontSize: '1.25rem', cursor: 'pointer', padding: '4px 8px' };
  const mobileOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 40, animation: 'fadeIn 200ms ease-in' };

  const itemsCls = isMobile
    ? 'grid grid-cols-4 gap-2 py-1'
    : isTablet
    ? 'grid grid-cols-1 gap-2 py-2'
    : 'grid gap-3 py-2';
  const itemsStyle = (!isMobile && !isTablet) ? { gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' } : undefined;

  return (
    <>
      {isMobile && (
        <>
          <button onClick={() => onToggleVisibility(!isVisible)} style={paletteToggleStyle} title="Toggle components palette">+</button>
          {isVisible && <div style={mobileOverlayStyle} onClick={() => onToggleVisibility(false)} />}
        </>
      )}

      <div className={containerCls} style={containerStyle || undefined}>
        <div className={isMobile ? 'flex items-center gap-2 p-4 border-b border-slate-200 relative' : ''}>
          {isMobile && <button onClick={() => onToggleVisibility(false)} style={closeButtonStyle} title="Close palette">x</button>}
          <h3 className="text-base font-semibold text-slate-800 m-0">Components</h3>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative flex">
            <input type="text" placeholder={isMobile ? 'Search...' : 'Search components...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 border border-slate-200 rounded-md text-sm box-border" />
            {searchTerm && <button onClick={() => setSearchTerm('')} style={clearSearchButtonStyle} title="Clear search">x</button>}
          </div>
          {!isMobile && <div className="text-slate-400 text-xs text-right mt-1">Showing {filteredComponents.length} of {allComponents.length}</div>}

          {allComponents.length === 0 ? (
            <div className="py-15 px-10 text-center bg-slate-50 rounded-xl">
              <div className="text-5xl mb-5 block">+</div>
              <h3 className="text-lg font-semibold text-gray-800 m-0 mb-3">No components yet</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">Create components to extend your design system.</p>
            </div>
          ) : filteredComponents.length === 0 ? (
            <div className="py-15 px-10 text-center bg-slate-50 rounded-xl">
              <div className="text-5xl mb-5 block">?</div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">No components match "{searchTerm}"</p>
            </div>
          ) : searchTerm || isMobile ? (
            <div
              className={isMobile ? 'grid grid-cols-4 gap-3 px-3' : isTablet ? 'grid grid-cols-1 gap-3' : 'grid gap-4'}
              style={(!isMobile && !isTablet) ? { gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' } : undefined}
            >
              {filteredComponents.map(type => (
                <PaletteComponentCard key={type} type={type} isMobile={isMobile} isTablet={isTablet} dragLongPressed={dragLongPressed} setDragLongPressed={setDragLongPressed} />
              ))}
            </div>
          ) : (
            <div>
              {categorized.map(cat => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between py-2 cursor-pointer border-b border-slate-100 select-none" onClick={() => toggleCategory(cat.name)}>
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{cat.name}</span>
                    <span className="text-[0.688rem] text-slate-400 font-medium">{cat.items.length} {collapsedCategories[cat.name] ? '>' : 'v'}</span>
                  </div>
                  {!collapsedCategories[cat.name] && (
                    <div className={itemsCls} style={itemsStyle}>
                      {cat.items.map(type => (
                        <PaletteComponentCard key={type} type={type} isMobile={isMobile} isTablet={isTablet} dragLongPressed={dragLongPressed} setDragLongPressed={setDragLongPressed} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!isMobile && (
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-slate-800 m-0">Page Structure</h3>
            <div className="flex flex-col">
              {pageData && pageData.components && pageData.components.map(component => (
                <PaletteTreeNode key={component.id} component={component} selectedId={selectedId} onSelect={onSelect} onDelete={onDelete} onDuplicate={onDuplicate} setDeleteConfirm={setDeleteConfirm} />
              ))}
            </div>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl shadow-2xl max-w-[500px] w-[90%]">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 m-0 mb-3">Remove component</h3>
              <p className="text-sm text-gray-600 m-0 leading-relaxed">Remove '{deleteConfirm.componentName}' from page? This cannot be undone.</p>
            </div>
            <div className="flex gap-3 justify-end px-6 pb-6 border-t border-gray-100">
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-ghost btn-sm min-h-[44px]">Cancel</button>
              <button onClick={() => { onDelete(deleteConfirm.componentId); setDeleteConfirm(null); }} className="btn btn-error btn-sm min-h-[44px]">Remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
