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
import Card from '../components/Card.js';
import AlertBox from '../components/AlertBox.js';
import Hero from '../components/Hero.js';
import Testimonial from '../components/Testimonial.js';
import Navbar from '../components/Navbar.js';
import FooterBlock from '../components/FooterBlock.js';
import PricingCard from '../components/PricingCard.js';
import ContactForm from '../components/ContactForm.js';
import PageLayout from '../components/PageLayout.js';
import RendererEditWrapper from './RendererEditWrapper.js';

const COMPONENT_MAP = { Button, Text, Container, Section, Heading, Image, Grid, Divider, Link, List, Card, AlertBox, Hero, Testimonial, Navbar, FooterBlock, PricingCard, ContactForm };

const getDefaultProps = (schema) => {
  if (!schema.props) return {};
  const defaults = {};
  Object.entries(schema.props).forEach(([k, v]) => { if (v.default !== undefined) defaults[k] = v.default; });
  return defaults;
};

const unknownStyle = { padding: '12px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '4px', color: '#991b1b', fontSize: '14px' };

const Renderer = ({ pageData, mode = 'view', selectedId, onSelectComponent, onDelete, onDuplicate, layout }) => {
  const renderComponent = (component, index) => {
    if (!component) return null;
    const { id, type, props, style, children } = component;

    const schema = componentRegistry.getComponent(type);
    if (!schema) return <div key={id || index} style={unknownStyle}>Unknown component: {type}</div>;

    const Component = componentLoader.getComponentImplementation(type) || COMPONENT_MAP[type];
    if (!Component) return <div key={id || index} style={unknownStyle}>Component not implemented: {type}</div>;

    const mergedProps = { ...getDefaultProps(schema), ...(props || {}) };
    const mergedStyle = { ...schema.defaultStyle, ...(style || {}) };
    const renderedChildren = children?.length > 0 ? children.map((child, i) => renderComponent(child, i)) : undefined;
    const componentProps = { ...mergedProps, style: mergedStyle, children: renderedChildren };

    if (mode === 'edit') {
      const isSelected = selectedId === id;
      const isContainer = schema.allowedChildren?.length > 0;
      const isEmpty = !renderedChildren || renderedChildren.length === 0;
      return (
        <RendererEditWrapper key={id || index} id={id} type={type} index={index} isSelected={isSelected} isContainer={isContainer} isEmpty={isEmpty} onSelect={onSelectComponent} onDelete={onDelete} onDuplicate={onDuplicate}>
          <Component {...componentProps} />
        </RendererEditWrapper>
      );
    }

    return <Component key={id || index} {...componentProps} />;
  };

  if (!pageData?.components) {
    const content = <div style={{ padding: '20px', color: '#64748b' }}>No content to display</div>;
    return layout ? <PageLayout layout={layout} pageTitle={pageData?.title}>{content}</PageLayout> : content;
  }

  const renderedContent = (
    <div className="renderer" style={{ width: '100%' }}>
      {pageData.components.map((component, index) => renderComponent(component, index))}
    </div>
  );

  return layout ? <PageLayout layout={layout} pageTitle={pageData?.title}>{renderedContent}</PageLayout> : renderedContent;
};

export default Renderer;
