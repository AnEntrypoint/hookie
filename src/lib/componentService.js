// componentService.js - Centralized service for all component operations
// Provides CRUD, validation, search, and rendering for components

import componentRegistry from './componentRegistry';
import { parseDefaultValue } from '../admin/validators';

// Custom error classes
export class ComponentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ComponentError';
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * ComponentService - Centralized service for component operations
 */
export class ComponentService {
  constructor(registry, renderer = null) {
    this.registry = registry;
    this.renderer = renderer;
  }

  // ============================================================================
  // CRUD Operations
  // ============================================================================

  /**
   * Create a new component instance with validation
   * @param {string} type - Component type name
   * @param {Object} props - Component props (merged with defaults)
   * @param {Array} children - Child component instances
   * @returns {Object} New component object
   * @throws {ComponentError} If component type unknown
   * @throws {ValidationError} If validation fails
   */
  create(type, props = {}, children = []) {
    const schema = this.registry.getComponent(type);
    if (!schema) {
      throw new ComponentError(`Unknown component type: ${type}`);
    }

    const component = {
      id: this.generateId(),
      type,
      props: { ...this.getDefaults(schema), ...props },
      style: { ...schema.defaultStyle },
      children
    };

    const validation = this.validateComponent(component, schema);
    if (!validation.valid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    return component;
  }

  /**
   * Duplicate a component with new IDs (recursively for children)
   * @param {Object} component - Component to duplicate
   * @param {Object} pageData - Page data (for resolving child references)
   * @returns {Object} Duplicated component with new IDs
   * @throws {Error} If component is null/undefined
   */
  duplicate(component, pageData) {
    if (!component) {
      throw new Error('Component is required');
    }

    const duplicated = { ...component, id: this.generateId() };

    // Recursively duplicate children
    if (component.children && component.children.length > 0) {
      duplicated.children = component.children.map(child => {
        // Handle both component objects and ID references
        const childComponent = typeof child === 'string' || (child && child.id)
          ? this.findById(pageData, child.id || child)
          : child;

        return childComponent ? this.duplicate(childComponent, pageData) : child;
      });
    }

    return duplicated;
  }

  /**
   * Delete a component from page data by ID (recursively searches tree)
   * @param {Object} pageData - Page data structure
   * @param {string} componentId - ID of component to delete
   * @returns {Object} New page data with component removed
   */
  delete(pageData, componentId) {
    if (!pageData || !pageData.components) {
      return pageData;
    }

    const newPageData = { ...pageData };
    newPageData.components = this.findAndDelete(pageData.components, componentId);
    return newPageData;
  }

  /**
   * Update a component with validation
   * @param {Object} component - Current component
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated component
   * @throws {ValidationError} If updates are invalid
   */
  update(component, updates) {
    const updated = { ...component, ...updates };
    const schema = this.registry.getComponent(component.type);

    if (!schema) {
      throw new ComponentError(`Unknown component type: ${component.type}`);
    }

    const validation = this.validateComponent(updated, schema);
    if (!validation.valid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    return updated;
  }

  // ============================================================================
  // Search & Query
  // ============================================================================

  /**
   * Find all components matching a predicate
   * @param {Object} pageData - Page data structure
   * @param {Function} predicate - Function (component) => boolean
   * @returns {Array} Array of matching components
   */
  find(pageData, predicate) {
    if (!pageData || !pageData.components) {
      return [];
    }

    const results = [];
    const traverse = (components) => {
      components.forEach(comp => {
        if (predicate(comp)) {
          results.push(comp);
        }
        if (comp.children && Array.isArray(comp.children)) {
          traverse(comp.children);
        }
      });
    };

    traverse(pageData.components);
    return results;
  }

  /**
   * Find a component by ID
   * @param {Object} pageData - Page data structure
   * @param {string} id - Component ID
   * @returns {Object|undefined} Component or undefined if not found
   */
  findById(pageData, id) {
    return this.find(pageData, c => c.id === id)[0];
  }

  /**
   * Find all components by type
   * @param {Object} pageData - Page data structure
   * @param {string} type - Component type name
   * @returns {Array} Array of components of specified type
   */
  findByType(pageData, type) {
    return this.find(pageData, c => c.type === type);
  }

  // ============================================================================
  // Validation
  // ============================================================================

  /**
   * Check if parent component can contain child component
   * @param {string} parentType - Parent component type
   * @param {string} childType - Child component type
   * @returns {boolean} True if allowed
   */
  canContainChild(parentType, childType) {
    const parentSchema = this.registry.getComponent(parentType);
    if (!parentSchema) return false;
    if (!parentSchema.allowedChildren) return true; // Allow any if not restricted
    if (parentSchema.allowedChildren.includes('*')) return true; // Wildcard
    if (parentSchema.allowedChildren.length === 0) return false; // No children allowed
    return parentSchema.allowedChildren.includes(childType);
  }

  /**
   * Validate a component against its schema
   * @param {Object} component - Component to validate
   * @param {Object} schema - Component schema
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateComponent(component, schema) {
    const errors = [];

    if (!component) {
      errors.push('Component is required');
      return { valid: false, errors };
    }

    if (!schema) {
      errors.push(`Schema not found for component type: ${component.type}`);
      return { valid: false, errors };
    }

    // Validate required props
    if (schema.props) {
      Object.entries(schema.props).forEach(([propName, propSchema]) => {
        if (propSchema.required && (component.props[propName] === undefined || component.props[propName] === null)) {
          errors.push(`Required prop missing: ${propName}`);
        }

        // Validate enum/options
        const propValue = component.props[propName];
        if (propValue !== undefined && propValue !== null) {
          if (propSchema.enum && Array.isArray(propSchema.enum)) {
            if (!propSchema.enum.includes(propValue)) {
              errors.push(`Invalid value for ${propName}: "${propValue}". Must be one of: ${propSchema.enum.join(', ')}`);
            }
          } else if (propSchema.options && Array.isArray(propSchema.options)) {
            if (!propSchema.options.includes(propValue)) {
              errors.push(`Invalid value for ${propName}: "${propValue}". Must be one of: ${propSchema.options.join(', ')}`);
            }
          }
        }

        // Validate type
        if (propValue !== undefined && propValue !== null) {
          const typeValid = this.validatePropType(propValue, propSchema.type);
          if (!typeValid) {
            errors.push(`Invalid type for ${propName}: expected ${propSchema.type}, got ${typeof propValue}`);
          }
        }
      });
    }

    // Validate children
    if (component.children && Array.isArray(component.children)) {
      component.children.forEach((child, index) => {
        if (child && child.type) {
          if (!this.canContainChild(component.type, child.type)) {
            errors.push(`Component ${component.type} cannot contain child of type ${child.type} at index ${index}`);
          }
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate prop value type
   * @param {*} value - Prop value
   * @param {string} expectedType - Expected type
   * @returns {boolean} True if type matches
   */
  validatePropType(value, expectedType) {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'function':
        return typeof value === 'function';
      case 'node':
        // React node - allow strings, numbers, elements, arrays
        return true;
      default:
        return true;
    }
  }

  // ============================================================================
  // Rendering
  // ============================================================================

  /**
   * Render a component using the renderer
   * @param {Object} component - Component to render
   * @param {string} mode - 'view' or 'edit'
   * @returns {*} Rendered component (React element if renderer provided)
   */
  render(component, mode = 'view') {
    if (!this.renderer || !this.renderer.renderComponent) {
      console.warn('Renderer not configured for ComponentService');
      return null;
    }
    return this.renderer.renderComponent(component, mode);
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Generate a unique component ID
   * @returns {string} Unique ID in format "comp-{timestamp}-{random}"
   */
  generateId() {
    return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extract default prop values from schema
   * @param {Object} schema - Component schema
   * @returns {Object} Object with default prop values
   */
  getDefaults(schema) {
    const defaults = {};
    if (schema.props) {
      Object.entries(schema.props).forEach(([name, prop]) => {
        if (prop.default !== undefined) {
          defaults[name] = prop.default;
        }
      });
    }
    return defaults;
  }

  /**
   * Recursively delete component from array by ID
   * @private
   * @param {Array} components - Components array
   * @param {string} id - Component ID to delete
   * @returns {Array} New array with component removed
   */
  findAndDelete(components, id) {
    return components
      .filter(c => c.id !== id)
      .map(c => ({
        ...c,
        children: c.children && Array.isArray(c.children)
          ? this.findAndDelete(c.children, id)
          : c.children
      }));
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const componentService = new ComponentService(componentRegistry);
export default componentService;
