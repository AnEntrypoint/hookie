import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentPalette from './ComponentPalette';
import BuilderCanvas from './BuilderCanvas';
import PropsEditor from './PropsEditor';
import componentRegistry from '../lib/componentRegistry';
import { deepClone, removeComponentById, findComponentById, updateComponentProps } from './builderHelpers';

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
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleRedo();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId) {
        e.preventDefault();
        handleDelete(selectedComponentId);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedComponentId) {
        e.preventDefault();
        handleDuplicate(selectedComponentId);
      }
      if (e.key === 'Escape') {
        setSelectedComponentId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, historyIndex, history]);

  const addToHistory = (newPageData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(deepClone(newPageData));
    
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  };

  const handleUpdate = (updatedPageData) => {
    addToHistory(updatedPageData);
    onUpdate(updatedPageData);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onUpdate(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onUpdate(history[newIndex]);
    }
  };

  const handleSelectComponent = (componentId) => {
    setSelectedComponentId(componentId);
  };

  const handleDelete = (componentId) => {
    const newPageData = removeComponentById(pageData, componentId);
    handleUpdate(newPageData);
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
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

  const paletteShouldShow = !isMobile;

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={styles.builder}>
        {paletteShouldShow && (
          <div style={isMobile ? styles.leftMobile : isTablet ? styles.leftTablet : styles.left}>
            <ComponentPalette
              pageData={pageData}
              selectedId={selectedComponentId}
              onSelect={handleSelectComponent}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              isVisible={paletteVisible}
              onToggleVisibility={setPaletteVisible}
            />
          </div>
        )}

        {isMobile && (
          <ComponentPalette
            pageData={pageData}
            selectedId={selectedComponentId}
            onSelect={handleSelectComponent}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            isVisible={paletteVisible}
            onToggleVisibility={setPaletteVisible}
          />
        )}

        <div style={{...styles.center, flex: paletteShouldShow && !paletteVisible ? 0 : undefined}}>
          <BuilderCanvas
            pageData={pageData}
            selectedId={selectedComponentId}
            onUpdate={handleUpdate}
            onSelectComponent={handleSelectComponent}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={handleUndo}
            onRedo={handleRedo}
            paletteVisible={paletteVisible}
            isMobile={isMobile}
          />
        </div>

        {isMobile && showMobilePropsPanel ? (
          <PropsEditor
            component={selectedComponentId ? findComponentById(pageData, selectedComponentId) : null}
            schema={selectedComponentId ? componentRegistry.getComponent(findComponentById(pageData, selectedComponentId)?.type) : null}
            onChange={(updatedProps) => {
              const newPageData = deepClone(pageData);
              const comp = findComponentById(newPageData, selectedComponentId);
              if (comp) {
                comp.props = updatedProps;
                handleUpdate(newPageData);
              }
            }}
            onClose={() => setShowMobilePropsPanel(false)}
            isMobile={true}
          />
        ) : null}

        <div style={isMobile ? styles.rightMobile : isTablet ? styles.rightTablet : styles.right}>
          {selectedComponentId ? (() => {
            const component = findComponentById(pageData, selectedComponentId);
            const schema = component ? componentRegistry.getComponent(component.type) : null;
            return isMobile ? (
              <button
                onClick={() => setShowMobilePropsPanel(true)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Edit Properties
              </button>
            ) : (
              <PropsEditor
                component={component}
                schema={schema}
                onChange={(updatedProps) => {
                  const newPageData = deepClone(pageData);
                  const comp = findComponentById(newPageData, selectedComponentId);
                  if (comp) {
                    comp.props = updatedProps;
                    handleUpdate(newPageData);
                  }
                }}
                isMobile={false}
              />
            );
          })() : (
            <div style={styles.placeholder}>
              Select a component to edit props
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

const styles = {
  builder: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc' },
  left: { width: '20%', minWidth: '250px', borderRight: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#ffffff', overflowY: 'auto', transition: 'width 300ms ease-in-out' },
  leftMobile: { display: 'none' },
  leftTablet: { width: '200px', minWidth: 'unset', padding: '12px' },
  center: { flex: '1', display: 'flex', flexDirection: 'column', transition: 'flex 300ms ease-in-out' },
  right: { width: '25%', minWidth: '300px', borderLeft: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#ffffff', overflowY: 'auto' },
  rightMobile: { display: 'none' },
  rightTablet: { width: '100%', minWidth: 'unset', borderLeft: 'none', borderTop: '1px solid #e2e8f0', height: 'auto', maxHeight: '200px', padding: '12px' },
  placeholder: { padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' },
};
