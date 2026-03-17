import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentPalette from './ComponentPalette';
import BuilderCanvas from './BuilderCanvas';
import PropsEditor from './PropsEditor';
import BuilderPropsPanel from './BuilderPropsPanel';
import { deepClone, removeComponentById, findComponentById } from './builderHelpers';
import { styles } from './builderStyles.js';

function useResponsiveBuilder() {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    return window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize(width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

export default function Builder({ pageData, onUpdate }) {
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [history, setHistory] = useState([deepClone(pageData)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [paletteVisible, setPaletteVisible] = useState(true);
  const [showMobilePropsPanel, setShowMobilePropsPanel] = useState(false);
  const screenSize = useResponsiveBuilder();
  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';

  useEffect(() => {
    if (pageData && JSON.stringify(pageData) !== JSON.stringify(history[historyIndex])) {
      addToHistory(pageData);
    }
  }, [pageData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') { e.preventDefault(); handleRedo(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId) { e.preventDefault(); handleDelete(selectedComponentId); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedComponentId) { e.preventDefault(); handleDuplicate(selectedComponentId); }
      if (e.key === 'Escape') setSelectedComponentId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, historyIndex, history]);

  const addToHistory = (newPageData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(deepClone(newPageData));
    if (newHistory.length > 50) { newHistory.shift(); } else { setHistoryIndex(historyIndex + 1); }
    setHistory(newHistory);
  };

  const handleUpdate = (updatedPageData) => {
    addToHistory(updatedPageData);
    onUpdate(updatedPageData);
  };

  const handleUndo = () => {
    if (historyIndex > 0) { const i = historyIndex - 1; setHistoryIndex(i); onUpdate(history[i]); }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) { const i = historyIndex + 1; setHistoryIndex(i); onUpdate(history[i]); }
  };

  const handleDelete = (componentId) => {
    handleUpdate(removeComponentById(pageData, componentId));
    if (selectedComponentId === componentId) setSelectedComponentId(null);
  };

  const handleDuplicate = (componentId) => {
    const component = findComponentById(pageData, componentId);
    if (!component) return;
    const duplicated = deepClone(component);
    duplicated.id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPageData = deepClone(pageData);
    newPageData.components.push(duplicated);
    handleUpdate(newPageData);
    setSelectedComponentId(duplicated.id);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={styles.builder}>
        {!isMobile && (
          <div style={isTablet ? styles.leftTablet : styles.left}>
            <ComponentPalette pageData={pageData} selectedId={selectedComponentId} onSelect={setSelectedComponentId} onDelete={handleDelete} onDuplicate={handleDuplicate} isVisible={paletteVisible} onToggleVisibility={setPaletteVisible} />
          </div>
        )}
        {isMobile && (
          <ComponentPalette pageData={pageData} selectedId={selectedComponentId} onSelect={setSelectedComponentId} onDelete={handleDelete} onDuplicate={handleDuplicate} isVisible={paletteVisible} onToggleVisibility={setPaletteVisible} />
        )}
        <div style={{...styles.center, flex: !isMobile && !paletteVisible ? 0 : undefined}}>
          <BuilderCanvas pageData={pageData} selectedId={selectedComponentId} onUpdate={handleUpdate} onSelectComponent={setSelectedComponentId} onDelete={handleDelete} onDuplicate={handleDuplicate} canUndo={historyIndex > 0} canRedo={historyIndex < history.length - 1} onUndo={handleUndo} onRedo={handleRedo} paletteVisible={paletteVisible} isMobile={isMobile} />
        </div>
        {isMobile && showMobilePropsPanel && (
          <PropsEditor
            component={findComponentById(pageData, selectedComponentId)}
            schema={componentRegistry.getComponent(findComponentById(pageData, selectedComponentId)?.type)}
            onChange={(updatedProps) => { const d = deepClone(pageData); const c = findComponentById(d, selectedComponentId); if (c) { c.props = updatedProps; handleUpdate(d); } }}
            onClose={() => setShowMobilePropsPanel(false)}
            isMobile={true}
          />
        )}
        <BuilderPropsPanel pageData={pageData} selectedComponentId={selectedComponentId} onUpdate={handleUpdate} isMobile={isMobile} isTablet={isTablet} onShowMobileProps={() => setShowMobilePropsPanel(true)} styles={styles} />
      </div>
    </DndProvider>
  );
}
