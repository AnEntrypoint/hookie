import React, { useEffect, useState, useRef } from 'react';
import { useMachine } from '@xstate/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { builderMachine } from '../machines/builderMachine';
import ComponentPalette from './ComponentPalette';
import BuilderCanvas from './BuilderCanvas';
import PropsEditor from './PropsEditor';
import BuilderPropsPanel from './BuilderPropsPanel';
import componentRegistry from '../lib/componentRegistry';
import { deepClone, removeComponentById, findComponentById } from './builderHelpers';
import { styles } from './builderStyles.js';
import { AutoSaveManager } from './autoSaveManager';
import RecoveryDialog from './RecoveryDialog';
import { useToast } from './Toast';

export default function Builder({ pageData, onUpdate, onAutosave }) {
  const [state, send] = useMachine(builderMachine);
  const { showToast } = useToast();
  const [recovery, setRecovery] = useState(null);
  const autoSaveRef = useRef(null);
  const ctx = state.context;
  const isMobile = ctx.screenSize === 'mobile';
  const isTablet = ctx.screenSize === 'tablet';

  useEffect(() => {
    if (state.matches('idle') && pageData) {
      const mgr = new AutoSaveManager(pageData.name);
      autoSaveRef.current = mgr;
      const saved = mgr.getRecoveryInfo();
      if (saved && JSON.stringify(saved.pageData) !== JSON.stringify(pageData)) {
        setRecovery(saved);
      } else {
        mgr.clear();
        send({ type: 'INIT', pageData });
      }
    } else if (state.matches('editing')) {
      send({ type: 'EXTERNAL_UPDATE', pageData });
    }
  }, [pageData]);

  useEffect(() => {
    return () => { autoSaveRef.current?.stop(); };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      send({ type: 'RESIZE', screenSize: w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop' });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') { e.preventDefault(); handleRedo(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && ctx.selectedComponentId) { e.preventDefault(); handleDelete(ctx.selectedComponentId); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && ctx.selectedComponentId) { e.preventDefault(); handleDuplicate(ctx.selectedComponentId); }
      if (e.key === 'Escape') send({ type: 'DESELECT' });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ctx.selectedComponentId, ctx.historyIndex, ctx.history]);

  const handleUpdate = (updatedPageData) => {
    send({ type: 'UPDATE_PAGE', pageData: updatedPageData });
    autoSaveRef.current?.save(updatedPageData);
    onUpdate(updatedPageData);
    onAutosave?.();
  };

  const handleUndo = () => {
    send({ type: 'UNDO' });
    if (ctx.historyIndex > 0) onUpdate(ctx.history[ctx.historyIndex - 1]);
  };

  const handleRedo = () => {
    send({ type: 'REDO' });
    if (ctx.historyIndex < ctx.history.length - 1) onUpdate(ctx.history[ctx.historyIndex + 1]);
  };

  const handleDelete = (componentId) => {
    const comp = findComponentById(ctx.pageData, componentId);
    const updated = removeComponentById(ctx.pageData, componentId);
    send({ type: 'DELETE_COMPONENT', id: componentId });
    handleUpdate(updated);
    showToast(`Deleted ${comp?.type || 'component'}`, 'info');
  };

  const handleDuplicate = (componentId) => {
    const component = findComponentById(ctx.pageData, componentId);
    if (!component) return;
    const duplicated = deepClone(component);
    duplicated.id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPageData = deepClone(ctx.pageData);
    newPageData.components.push(duplicated);
    handleUpdate(newPageData);
    send({ type: 'SELECT', id: duplicated.id });
    showToast(`Duplicated ${component.type}`, 'success');
  };

  const handleRecover = () => {
    const data = recovery.pageData;
    setRecovery(null);
    send({ type: 'INIT', pageData: data });
  };

  const handleDiscardRecovery = () => {
    autoSaveRef.current?.clear();
    setRecovery(null);
    send({ type: 'INIT', pageData });
  };

  if (recovery) {
    return <RecoveryDialog recovery={recovery} onRecover={handleRecover} onDiscard={handleDiscardRecovery} />;
  }

  if (!ctx.pageData) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={styles.builder}>
        {!isMobile && (
          <div style={isTablet ? styles.leftTablet : styles.left}>
            <ComponentPalette pageData={ctx.pageData} selectedId={ctx.selectedComponentId} onSelect={id => send({ type: 'SELECT', id })} onDelete={handleDelete} onDuplicate={handleDuplicate} isVisible={ctx.paletteVisible} onToggleVisibility={v => send({ type: 'SET_PALETTE', visible: v })} />
          </div>
        )}
        {isMobile && (
          <ComponentPalette pageData={ctx.pageData} selectedId={ctx.selectedComponentId} onSelect={id => send({ type: 'SELECT', id })} onDelete={handleDelete} onDuplicate={handleDuplicate} isVisible={ctx.paletteVisible} onToggleVisibility={v => send({ type: 'SET_PALETTE', visible: v })} />
        )}
        <div style={{...styles.center, flex: !isMobile && !ctx.paletteVisible ? 0 : undefined}}>
          <BuilderCanvas pageData={ctx.pageData} selectedId={ctx.selectedComponentId} onUpdate={handleUpdate} onSelectComponent={id => send({ type: 'SELECT', id })} onDelete={handleDelete} onDuplicate={handleDuplicate} canUndo={ctx.historyIndex > 0} canRedo={ctx.historyIndex < ctx.history.length - 1} onUndo={handleUndo} onRedo={handleRedo} paletteVisible={ctx.paletteVisible} isMobile={isMobile} />
        </div>
        {isMobile && ctx.showMobilePropsPanel && (
          <PropsEditor
            component={findComponentById(ctx.pageData, ctx.selectedComponentId)}
            schema={componentRegistry.getComponent(findComponentById(ctx.pageData, ctx.selectedComponentId)?.type)}
            onChange={(updatedProps) => { const d = deepClone(ctx.pageData); const c = findComponentById(d, ctx.selectedComponentId); if (c) { c.props = updatedProps; handleUpdate(d); } }}
            onClose={() => send({ type: 'HIDE_MOBILE_PROPS' })}
            isMobile={true}
          />
        )}
        <BuilderPropsPanel pageData={ctx.pageData} selectedComponentId={ctx.selectedComponentId} onUpdate={handleUpdate} isMobile={isMobile} isTablet={isTablet} onShowMobileProps={() => send({ type: 'SHOW_MOBILE_PROPS' })} styles={styles} />
      </div>
    </DndProvider>
  );
}
