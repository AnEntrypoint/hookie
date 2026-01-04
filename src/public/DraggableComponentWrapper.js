import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { updateDragState } from '../lib/debuggingSetup.js';

export function DraggableComponentWrapper({
  id,
  type,
  isSelected,
  onSelect,
  canAcceptChildren,
  onDropComponent,
  children
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CANVAS_COMPONENT',
    item: { id, type, fromCanvas: true },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      updateDragState({
        isActive: false,
        draggedId: null,
        draggedType: null,
      });
    }
  }), [id, type]);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['COMPONENT', 'CANVAS_COMPONENT'],
    canDrop: (item) => {
      if (!canAcceptChildren) return false;
      if (item.id === id) return false;
      return true;
    },
    drop: (item) => {
      if (onDropComponent) {
        onDropComponent(item, id, 'inside');
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        updateDragState({
          isActive: true,
          draggedId: item.id,
          draggedType: item.type,
          targetParent: id,
          targetPosition: 'inside',
          hoveredId: id
        });
      }
    }
  }), [id, canAcceptChildren]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(id);
    }
  };

  const ref = canAcceptChildren ? drop : null;

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`builder-component-wrapper ${isSelected ? 'selected' : ''}`}
      data-component-id={id}
      data-component-type={type}
      draggable
      onDragStart={() => {
        updateDragState({
          isActive: true,
          draggedId: id,
          draggedType: 'CANVAS_COMPONENT'
        });
      }}
      style={{
        position: 'relative',
        outline: isSelected ? '2px solid #2563eb' : isOver && canDrop ? '2px dashed #10b981' : 'none',
        backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.05)' : isOver && canDrop ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
        borderRadius: '4px',
        transition: 'all 150ms ease-in-out',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isOver && canDrop ? 'inset 0 0 4px rgba(16, 185, 129, 0.3)' : 'none'
      }}
    >
      {children}

      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '-24px',
          left: '0',
          fontSize: '11px',
          color: '#2563eb',
          fontWeight: '600',
          backgroundColor: '#dbeafe',
          padding: '2px 8px',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {type}
        </div>
      )}

      {isOver && canDrop && !children && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#10b981',
          fontWeight: '500',
          textAlign: 'center',
          minHeight: '60px',
          pointerEvents: 'none'
        }}>
          Drop here
        </div>
      )}
    </div>
  );
}
