import React from 'react';
import { componentRegistry } from '../lib/componentRegistry.js';
import { componentLoader } from '../lib/componentLoader.js';
import Button from '../components/Button.js';
import Text from '../components/Text.js';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import Heading from '../components/Heading.js';
import Image from '../components/Image.js';
import Grid from '../components/Grid.js';
import Divider from '../components/Divider.js';
import Link from '../components/Link.js';
import List from '../components/List.js';

const COMPONENT_MAP = {
  Button,
  Text,
  Container,
  Section,
  Heading,
  Image,
  Grid,
  Divider,
  Link,
  List
};

const getDefaultProps = (schema) => {
  const defaults = {};
  
  if (!schema.props) return defaults;

  Object.entries(schema.props).forEach(([propName, propSchema]) => {
    if (propSchema.default !== undefined) {
      defaults[propName] = propSchema.default;
    }
  });

  return defaults;
};

const Renderer = ({ 
  pageData, 
  mode = 'view',
  selectedId,
  onSelectComponent,
  onPropsChange
}) => {
  
  const renderComponent = (component, index, parent) => {
    if (!component) return null;
    
    const { id, type, props, style, children } = component;

    // Get component schema from registry
    const schema = componentRegistry.getComponent(type);
    if (!schema) {
      return (
        <div key={id || index} style={{
          padding: '12px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#991b1b',
          fontSize: '14px'
        }}>
          Unknown component: {type}
        </div>
      );
    }

    const Component = componentLoader.getComponentImplementation(type) || COMPONENT_MAP[type];
    if (!Component) {
      return (
        <div key={id || index} style={{
          padding: '12px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#991b1b',
          fontSize: '14px'
        }}>
          Component not implemented: {type}
        </div>
      );
    }

    // Merge schema default props with instance props
    const mergedProps = { ...getDefaultProps(schema), ...(props || {}) };

    // Merge default style with instance style
    const mergedStyle = { ...schema.defaultStyle, ...(style || {}) };

    // Render children recursively
    const renderedChildren = children && children.length > 0
      ? children.map((child, i) => renderComponent(child, i, component))
      : undefined;

    // Build final props for component
    const componentProps = {
      ...mergedProps,
      style: mergedStyle,
      children: renderedChildren
    };

    // In edit mode, wrap with selection handling and visual feedback
    if (mode === 'edit') {
      const isSelected = selectedId === id;
      const isContainer = schema.allowedChildren && schema.allowedChildren.length > 0;
      const isEmpty = !renderedChildren || renderedChildren.length === 0;

      const handleClick = (e) => {
        e.stopPropagation();
        if (onSelectComponent) {
          onSelectComponent(id);
        }
      };

      return (
        <div
          key={id || index}
          className={`builder-component-wrapper ${isSelected ? 'selected' : ''}`}
          onClick={handleClick}
          data-component-id={id}
          data-component-type={type}
          style={{
            position: 'relative',
            outline: isSelected ? '2px solid #2563eb' : (isContainer && isEmpty ? '2px dashed #cbd5e1' : 'none'),
            backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.05)' : (isContainer && isEmpty ? 'rgba(203, 213, 225, 0.05)' : 'transparent'),
            borderRadius: '4px',
            transition: 'all 150ms ease-in-out',
            cursor: 'pointer',
            minHeight: isContainer && isEmpty ? '80px' : undefined
          }}
        >
          <Component {...componentProps} />
          
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
        </div>
      );
    }

    // View mode: render component directly without wrappers
    return (
      <Component
        key={id || index}
        {...componentProps}
      />
    );
  };

  if (!pageData || !pageData.components) {
    return <div style={{ padding: '20px', color: '#64748b' }}>No content to display</div>;
  }

  return (
    <div className="renderer" style={{ width: '100%' }}>
      {pageData.components.map((component, index) => 
        renderComponent(component, index, null)
      )}
    </div>
  );
};

export default Renderer;
