// builderHelpers.js - Pure utility functions for Builder operations

/**
 * Generate a unique component ID
 * @returns {string} Unique ID based on timestamp and random suffix
 */
export function generateUniqueId() {
  return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Recursively find a component in the page tree by ID
 * @param {object} pageData - Page data with components array
 * @param {string} id - Component ID to find
 * @returns {object|null} Component object or null if not found
 */
export function findComponentById(pageData, id) {
  if (!pageData || !pageData.components) return null;

  const search = (components) => {
    for (const component of components) {
      if (component.id === id) return component;
      if (component.children && component.children.length > 0) {
        const found = search(component.children);
        if (found) return found;
      }
    }
    return null;
  };

  return search(pageData.components);
}

/**
 * Recursively remove a component from the page tree by ID
 * @param {object} pageData - Page data with components array
 * @param {string} id - Component ID to remove
 * @returns {object} New page data with component removed
 */
export function removeComponentById(pageData, id) {
  const newPageData = deepClone(pageData);

  const removeFromArray = (components) => {
    for (let i = 0; i < components.length; i++) {
      if (components[i].id === id) {
        components.splice(i, 1);
        return true;
      }
      if (components[i].children && components[i].children.length > 0) {
        if (removeFromArray(components[i].children)) {
          return true;
        }
      }
    }
    return false;
  };

  removeFromArray(newPageData.components);
  return newPageData;
}

/**
 * Deep clone an object for immutability
 * @param {any} obj - Object to clone
 * @returns {any} Deep cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
}

/**
 * Extract a smart title for component display in tree
 * @param {object} component - Component object
 * @returns {string} Display title
 */
export function getComponentTitle(component) {
  if (!component) return 'Unknown';
  
  const type = component.type || 'Component';
  const props = component.props || {};

  // Show key props based on component type
  if (type === 'Text' && props.children) {
    const text = typeof props.children === 'string' ? props.children : '';
    return `${type} (${text.substring(0, 24)}${text.length > 24 ? '...' : ''})`;
  }
  
  if (type === 'Container' && props.maxWidth) {
    return `${type} (maxWidth: ${props.maxWidth})`;
  }
  
  if (type === 'Heading' && props.level) {
    return `${type} (H${props.level})`;
  }
  
  if (type === 'Button' && props.children) {
    return `${type} (${props.children})`;
  }

  return type;
}

/**
 * Update component props by ID in page tree
 * @param {object} pageData - Page data
 * @param {string} componentId - ID of component to update
 * @param {object} newProps - New props object
 * @returns {object} New page data with updated props
 */
export function updateComponentProps(pageData, componentId, newProps) {
  const newPageData = deepClone(pageData);

  const updateInArray = (components) => {
    for (let i = 0; i < components.length; i++) {
      if (components[i].id === componentId) {
        components[i].props = { ...components[i].props, ...newProps };
        return true;
      }
      if (components[i].children && components[i].children.length > 0) {
        if (updateInArray(components[i].children)) {
          return true;
        }
      }
    }
    return false;
  };

  updateInArray(newPageData.components);
  return newPageData;
}
