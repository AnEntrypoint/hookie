# Builder Component

## Purpose
Main drag-and-drop page builder interface. Provides canvas for building pages, component tree view, and real-time preview.

## Component Type
React functional component

## Dependencies
- react-dnd for drag-and-drop functionality
- componentRegistry.md for component schemas
- Renderer.md for preview rendering

## Props
- `pageData` (object): Current page structure
  - Structure: { name, title, components: [] }
- `onUpdate` (function): Callback when page changes
  - Signature: `(updatedPageData) => void`

## State Management
Use React useState for:
- `selectedComponentId` (string|null): Currently selected component ID
- `history` (array): Undo/redo history stack (max 50 items)
- `historyIndex` (number): Current position in history
- `draggedComponent` (object|null): Component being dragged

## Layout Structure
Three-panel layout:
1. **Left Panel**: Component tree + component palette
2. **Center Panel**: Canvas with preview
3. **Right Panel**: Props editor + style editor (handled by parent)

## Left Panel - Component Tree
Display hierarchical tree of page components:
- Show component type and truncated props
- Highlight selected component
- Click to select component
- Drag to reorder (react-dnd)
- Delete button per component
- Duplicate button per component
- Collapse/expand nested components

## Left Panel - Component Palette
Display available component types from componentRegistry:
- Grid or list of component cards
- Show component name and description
- Drag component from palette to canvas (react-dnd)
- Filter/search components

## Center Panel - Canvas
Visual preview of the page:
- Render page using Renderer component
- Overlay selection outline on selected component
- Click component to select it
- Drop zones for adding components
- Show component boundaries on hover
- Real-time updates as props change
- Responsive preview mode toggle (desktop/tablet/mobile widths)

## Drag and Drop Logic

### Dragging from Palette
1. User drags component from palette
2. Create new component instance with default props
3. Show drop zones in canvas
4. On drop:
   - Generate unique component ID
   - Insert component at drop location
   - Add to page structure
   - Update history
   - Call onUpdate with new pageData

### Reordering Components
1. User drags component in tree
2. Show drop indicator
3. On drop:
   - Remove from old position
   - Insert at new position
   - Update page structure
   - Update history
   - Call onUpdate

### Nesting Components
1. Check if parent can contain child (componentRegistry.canContainChild)
2. If valid, allow drop into component
3. Update children array of parent
4. Update history and call onUpdate

## Component Operations

### Select Component
```
(componentId) => {
  setSelectedComponentId(componentId);
}
```

### Delete Component
```
(componentId) => {
  const updated = removeComponentById(pageData, componentId);
  addToHistory(updated);
  onUpdate(updated);
}
```

### Duplicate Component
```
(componentId) => {
  const component = findComponentById(pageData, componentId);
  const duplicated = deepClone(component);
  duplicated.id = generateUniqueId();
  const updated = insertComponentAfter(pageData, componentId, duplicated);
  addToHistory(updated);
  onUpdate(updated);
}
```

## Undo/Redo

### Undo
```
() => {
  if (historyIndex > 0) {
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    onUpdate(history[newIndex]);
  }
}
```

### Redo
```
() => {
  if (historyIndex < history.length - 1) {
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    onUpdate(history[newIndex]);
  }
}
```

### Add to History
```
(pageData) => {
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push(deepClone(pageData));
  if (newHistory.length > 50) {
    newHistory.shift(); // Keep only last 50 states
  }
  setHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
}
```

## Keyboard Shortcuts
- Ctrl/Cmd + Z: Undo
- Ctrl/Cmd + Shift + Z: Redo
- Delete/Backspace: Delete selected component
- Ctrl/Cmd + D: Duplicate selected component

## Helper Functions

### generateUniqueId()
Generate unique ID for components (use timestamp + random or UUID).

### findComponentById(pageData, id)
Recursively find component in tree by ID.

### removeComponentById(pageData, id)
Recursively remove component from tree.

### insertComponentAfter(pageData, id, newComponent)
Insert component after specified component.

### deepClone(obj)
Deep clone object to avoid reference issues.

## DOM Structure
```
<div class="builder">
  <div class="builder-left">
    <div class="component-palette">
      {/* Component cards */}
    </div>
    <div class="component-tree">
      {/* Tree view */}
    </div>
  </div>

  <div class="builder-center">
    <div class="builder-toolbar">
      <button onClick={undo} disabled={historyIndex === 0}>Undo</button>
      <button onClick={redo} disabled={historyIndex === history.length - 1}>Redo</button>
      <button onClick={togglePreviewMode}>Desktop/Tablet/Mobile</button>
    </div>
    <div class="builder-canvas">
      <Renderer pageData={pageData} onSelectComponent={selectComponent} selectedId={selectedComponentId} />
    </div>
  </div>
</div>
```

## Default Export
Export the Builder component as default export.

## Implementation Notes
- Use react-dnd's DndProvider, useDrag, useDrop hooks
- Maintain immutability when updating pageData
- Deep clone pageData before modifications
- Debounce onUpdate calls if needed for performance
- Cache Renderer output for performance
- Show loading state when rendering large pages
- Validate component nesting rules before allowing drops
- Highlight drop zones clearly during drag
- Show component outlines on canvas for clarity
- Handle deeply nested components efficiently
- Provide visual feedback for all operations
- Ensure keyboard shortcuts don't conflict with browser shortcuts
