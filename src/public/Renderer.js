import React, { useMemo } from 'react';
import { componentRegistry } from '../lib/componentRegistry.js';
import Button from '../components/Button.js';
import Text from '../components/Text.js';
import Container from '../components/Container.js';
import Heading from '../components/Heading.js';
import Image from '../components/Image.js';
import Divider from '../components/Divider.js';
import Section from '../components/Section.js';
import Grid from '../components/Grid.js';
import Link from '../components/Link.js';
import List from '../components/List.js';

const COMPONENT_MAP = {
  Button,
  Text,
  Container,
  Heading,
  Image,
  Divider,
  Section,
  Grid,
  Link,
  List
};

const getDefaultProps = (schema) => {
  const defaults = {};
  if (!schema || !schema.props) return defaults;

  Object.entries(schema.props).forEach(([propName, propSchema]) => {
    if (propSchema && propSchema.default !== undefined) {
      defaults[propName] = propSchema.default;
    }
  });

  return defaults;
};

const Renderer = ({ pageData, onSelectComponent, selectedId, mode = 'view' }) => {
  const renderComponent = useMemo(() => {
    return (component, index) => {
      if (!component) return null;

      const { id, type, props = {}, style = {}, children } = component;

      const schema = componentRegistry.getComponent(type);
      if (!schema) {
        console.warn(`Component type "${type}" not found in registry`);
        return (
          <div key={id || index} className="component-error" style={{
            padding: '20px',
            backgroundColor: '#ffe6e6',
            border: '1px solid #ff9999',
            borderRadius: '4px',
            margin: '10px 0',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#cc0000'
          }}>
            Unknown component: {type}
          </div>
        );
      }

      const Component = COMPONENT_MAP[type];
      if (!Component) {
        console.warn(`Component implementation for "${type}" not found`);
        return (
          <div key={id || index} className="component-error" style={{
            padding: '20px',
            backgroundColor: '#ffe6e6',
            border: '1px solid #ff9999',
            borderRadius: '4px',
            margin: '10px 0',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#cc0000'
          }}>
            Component not implemented: {type}
          </div>
        );
      }

      const mergedProps = { ...getDefaultProps(schema), ...props };
      const mergedStyle = { ...schema.defaultStyle, ...style };

      const renderedChildren = children && children.length > 0
        ? children.map((child, i) => renderComponent(child, i))
        : undefined;

      if (mode === 'edit') {
        return (
          <div
            key={id || index}
            className={`component-wrapper ${selectedId === id ? 'selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectComponent) {
                onSelectComponent(id);
              }
            }}
            data-component-id={id}
            data-component-type={type}
            style={{
              border: selectedId === id ? '2px solid #007bff' : '1px solid #e0e0e0',
              padding: '4px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Component
              {...mergedProps}
              style={mergedStyle}
              children={renderedChildren}
            />
          </div>
        );
      }

      return (
        <Component
          key={id || index}
          {...mergedProps}
          style={mergedStyle}
          children={renderedChildren}
        />
      );
    };
  }, [mode, selectedId, onSelectComponent]);

  if (!pageData || !pageData.components) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#999',
        fontFamily: 'sans-serif'
      }}>
        No content to display
      </div>
    );
  }

  return (
    <div className="renderer">
      {pageData.components.map((component, index) => renderComponent(component, index))}
    </div>
  );
};

export default Renderer;
