import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentPalette from './ComponentPalette';
import BuilderCanvas from './BuilderCanvas';
import PropsEditor from './PropsEditor';
import componentRegistry from '../lib/componentRegistry';
import { deepClone, removeComponentById, findComponentById, updateComponentProps } from './builderHelpers';

export default function Builder({ pageData, onUpdate }) {
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [history, setHistory] = useState([deepClone(pageData)]);
  const [historyIndex, setHistoryIndex] = useState(0);

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={styles.builder}>
        <div style={styles.left}>
          <ComponentPalette
            pageData={pageData}
            selectedId={selectedComponentId}
            onSelect={handleSelectComponent}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </div>

        <div style={styles.center}>
          <BuilderCanvas
            pageData={pageData}
            selectedId={selectedComponentId}
            onUpdate={handleUpdate}
            onSelectComponent={handleSelectComponent}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
        </div>

        <div style={styles.right}>
          {selectedComponentId ? (() => {
            const component = findComponentById(pageData, selectedComponentId);
            const schema = component ? componentRegistry.getComponent(component.type) : null;
            return (
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
  left: { width: '20%', minWidth: '250px', borderRight: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#ffffff', overflowY: 'auto' },
  center: { flex: '1', display: 'flex', flexDirection: 'column' },
  right: { width: '25%', minWidth: '300px', borderLeft: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#ffffff', overflowY: 'auto' },
  placeholder: { padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' },
};
