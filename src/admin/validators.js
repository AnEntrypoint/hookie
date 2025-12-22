// validators.js - Pure validation and parsing utilities for ComponentCreator

/**
 * Validates component name is PascalCase and unique
 * @param {string} name - Component name to validate
 * @param {Array<string>} existingComponents - List of existing component names
 * @returns {object} { valid: boolean, error: string|null }
 */
export function validateComponentName(name, existingComponents = []) {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Component name is required' };
  }

  // Check PascalCase (starts with uppercase, contains only letters and numbers)
  const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
  if (!pascalCaseRegex.test(name)) {
    return { 
      valid: false, 
      error: 'Component name must be PascalCase (e.g., MyComponent)' 
    };
  }

  // Check uniqueness
  if (existingComponents.includes(name)) {
    return { 
      valid: false, 
      error: `Component "${name}" already exists` 
    };
  }

  return { valid: true, error: null };
}

/**
 * Validates prop name is camelCase and unique within component
 * @param {string} name - Prop name to validate
 * @param {Array<string>} existingProps - List of existing prop names in this component
 * @returns {object} { valid: boolean, error: string|null }
 */
export function validatePropName(name, existingProps = []) {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Prop name is required' };
  }

  // Check camelCase (starts with lowercase, contains only letters and numbers)
  const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
  if (!camelCaseRegex.test(name)) {
    return { 
      valid: false, 
      error: 'Prop name must be camelCase (e.g., myProp)' 
    };
  }

  // Check uniqueness
  if (existingProps.includes(name)) {
    return { 
      valid: false, 
      error: `Prop "${name}" already exists in this component` 
    };
  }

  return { valid: true, error: null };
}

/**
 * Validates that a default value matches its declared type
 * @param {any} value - Default value to validate
 * @param {string} type - Expected type (string, number, boolean, array, object, node, function)
 * @returns {object} { valid: boolean, error: string|null }
 */
export function validateDefaultValue(value, type) {
  // Empty/null values are allowed (means no default)
  if (value === undefined || value === null || value === '') {
    return { valid: true, error: null };
  }

  switch (type) {
    case 'number':
      if (isNaN(Number(value))) {
        return { valid: false, error: 'Default value must be a valid number' };
      }
      break;
    
    case 'boolean':
      if (value !== 'true' && value !== 'false' && value !== true && value !== false) {
        return { valid: false, error: 'Default value must be true or false' };
      }
      break;
    
    case 'array':
    case 'object':
      try {
        JSON.parse(value);
      } catch (e) {
        return { valid: false, error: `Default value must be valid JSON for ${type}` };
      }
      break;
    
    // string, node, function types accept any value
    default:
      break;
  }

  return { valid: true, error: null };
}

/**
 * Parses a default value string into the appropriate type
 * @param {string} value - Value to parse
 * @param {string} type - Target type
 * @returns {any} Parsed value or undefined if empty
 */
export function parseDefaultValue(value, type) {
  // Return undefined for empty values
  if (!value || value.trim() === '') {
    return undefined;
  }

  switch (type) {
    case 'number':
      return Number(value);
    
    case 'boolean':
      return value === 'true' || value === true;
    
    case 'array':
      try {
        return JSON.parse(value);
      } catch (e) {
        return [];
      }
    
    case 'object':
      try {
        return JSON.parse(value);
      } catch (e) {
        return {};
      }
    
    default:
      return value;
  }
}
