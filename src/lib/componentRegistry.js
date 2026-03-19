import { builtinSchemas } from './componentSchemas.js';
import { displaySchemas } from './componentSchemasDisplay.js';

const schemas = { ...builtinSchemas, ...displaySchemas };

export function registerComponent(name, schema) {
  schemas[name] = schema;
}

export function getComponent(name) {
  return schemas[name] || null;
}

export function getAllComponents() {
  return Object.keys(schemas);
}

export function validateComponentProps(componentName, props) {
  return !!getComponent(componentName);
}

export function canContainChild(parentType, childType) {
  const schema = schemas[parentType];
  if (!schema) return true;
  const allowed = schema.allowedChildren || [];
  return allowed.includes('*') || allowed.includes(childType);
}

export const componentRegistry = {
  registerComponent,
  getComponent,
  getAllComponents,
  validateComponentProps,
  canContainChild
};

export default componentRegistry;
