import React, { useState, useEffect } from 'react';
import { componentRegistry } from '../lib/componentRegistry.js';

const Builder = ({ pageData, onUpdate }) => {
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [history, setHistory] = useState([pageData]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile

  // Initialize history with initial pageData
  useEffect(() => {
    setHistory([pageData]);
    setHistoryIndex(0);
  }, []);

  // Helper: Generate unique ID
  const generateUniqueId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Helper: Deep clone object
  const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  // Helper: Find component by ID
  const findComponentById = (data, id) => {
    if (!data || !data.components) return null;

    for (const comp of data.components) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponentById({ components: comp.children }, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper: Remove component by ID
  const removeComponentById = (data, id) => {
    const cloned = deepClone(data);

    const removeFromArray = (components) => {
      if (!components) return components;

      const filtered = components.filter(comp => {
        if (comp.id === id) return false;
        if (comp.children) {
          comp.children = removeFromArray(comp.children);
        }
        return true;
      });

      return filtered;
    };

    cloned.components = removeFromArray(cloned.components);
    return cloned;
  };

  // Helper: Insert component after specified ID
  const insertComponentAfter = (data, afterId, newComponent) => {
    const cloned = deepClone(data);

    const insertInArray = (components) => {
      if (!components) return components;

      const newArray = [];
      for (let i = 0; i < components.length; i++) {
        newArray.push(components[i]);
        if (components[i].id === afterId) {
          newArray.push(newComponent);
        }
        if (components[i].children) {
          components[i].children = insertInArray(components[i].children);
        }
      }
      return newArray;
    };

    cloned.components = insertInArray(cloned.components);
    return cloned;
  };

  // Add to history
  const addToHistory = (newPageData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(deepClone(newPageData));

    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onUpdate(history[newIndex]);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onUpdate(history[newIndex]);
    }
  };

  // Select component
  const selectComponent = (componentId) => {
    setSelectedComponentId(componentId);
  };

  // Delete component
  const deleteComponent = (componentId) => {
    const updated = removeComponentById(pageData, componentId);
    addToHistory(updated);
    onUpdate(updated);
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  };

  // Duplicate component
  const duplicateComponent = (componentId) => {
    const component = findComponentById(pageData, componentId);
    if (!component) return;

    const duplicated = deepClone(component);
    duplicated.id = generateUniqueId();

    // Update IDs of all children recursively
    const updateChildIds = (comp) => {
      if (comp.children) {
        comp.children = comp.children.map(child => {
          const newChild = { ...child, id: generateUniqueId() };
          updateChildIds(newChild);
          return newChild;
        });
      }
    };
    updateChildIds(duplicated);

    const updated = insertComponentAfter(pageData, componentId, duplicated);
    addToHistory(updated);
    onUpdate(updated);
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    const modes = ['desktop', 'tablet', 'mobile'];
    const currentIndex = modes.indexOf(previewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPreviewMode(modes[nextIndex]);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId) {
        e.preventDefault();
        deleteComponent(selectedComponentId);
      }

      // Duplicate: Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedComponentId) {
        e.preventDefault();
        duplicateComponent(selectedComponentId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, historyIndex, history]);

  // Get available components from registry
  const availableComponents = componentRegistry.getAllComponents ?
    componentRegistry.getAllComponents() : ['Button', 'Text', 'Container', 'Heading', 'Image', 'Divider'];

  // Render component tree
  const renderComponentTree = (components, depth = 0) => {
    if (!components) return null;

    return components.map((comp) => (
      <div
        key={comp.id}
        className={`tree-item ${selectedComponentId === comp.id ? 'selected' : ''}`}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        <div className="tree-item-content">
          <span onClick={() => selectComponent(comp.id)}>
            {comp.type} {comp.props && `(${Object.keys(comp.props).slice(0, 2).join(', ')})`}
          </span>
          <div className="tree-item-actions">
            <button onClick={() => duplicateComponent(comp.id)} title="Duplicate">⎘</button>
            <button onClick={() => deleteComponent(comp.id)} title="Delete">×</button>
          </div>
        </div>
        {comp.children && comp.children.length > 0 && renderComponentTree(comp.children, depth + 1)}
      </div>
    ));
  };

  // Get preview width based on mode
  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="builder">
      <div className="builder-left">
        <div className="component-palette">
          <h3>Components</h3>
          {availableComponents.map(compType => (
            <div
              key={compType}
              className="palette-item"
              draggable
              onDragStart={() => setDraggedComponent({ type: compType })}
            >
              {compType}
            </div>
          ))}
        </div>

        <div className="component-tree">
          <h3>Page Structure</h3>
          {renderComponentTree(pageData.components)}
        </div>
      </div>

      <div className="builder-center">
        <div className="builder-toolbar">
          <button onClick={undo} disabled={historyIndex === 0}>
            ↶ Undo
          </button>
          <button onClick={redo} disabled={historyIndex === history.length - 1}>
            ↷ Redo
          </button>
          <button onClick={togglePreviewMode}>
            {previewMode === 'desktop' ? '🖥 Desktop' :
             previewMode === 'tablet' ? '📱 Tablet' :
             '📱 Mobile'}
          </button>
        </div>

        <div className="builder-canvas" style={{ width: getPreviewWidth(), margin: '0 auto' }}>
          <div className="canvas-content">
            {/* Simple preview - in real implementation, use Renderer component */}
            <div style={{ border: '1px dashed #ccc', padding: '20px', minHeight: '400px' }}>
              <p>Canvas Preview</p>
              <p>Selected: {selectedComponentId || 'None'}</p>
              <p>Components: {pageData.components?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
