export class PageNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PageNotFoundError';
    this.status = 404;
  }
}

export class ComponentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ComponentNotFoundError';
    this.status = 404;
  }
}

export class JSONParseError extends Error {
  constructor(message, originalContent) {
    super(message);
    this.name = 'JSONParseError';
    this.originalContent = originalContent;
  }
}

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class SchemaValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'SchemaValidationError';
    this.field = field;
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export function isPageNotFound(error) {
  return error instanceof PageNotFoundError || 
         (error.status === 404 && error.message?.includes('page'));
}

export function isComponentNotFound(error) {
  return error instanceof ComponentNotFoundError || 
         (error.status === 404 && error.message?.includes('component'));
}

export function isAuthError(error) {
  return error instanceof AuthError || 
         (error.status === 401 || error.status === 403);
}

export function isNetworkError(error) {
  return error instanceof NetworkError || !error.response;
}

export function isJSONParseError(error) {
  return error instanceof JSONParseError || 
         error.message?.includes('JSON') || 
         error.message?.includes('parse');
}

export function mapErrorToUserMessage(error) {
  if (error instanceof PageNotFoundError) {
    return 'Page not found. It may have been deleted or renamed.';
  }
  if (error instanceof ComponentNotFoundError) {
    return 'Component not found. It may have been deleted or renamed.';
  }
  if (error instanceof JSONParseError) {
    return 'Invalid content format. The file may be corrupted.';
  }
  if (error instanceof ValidationError) {
    return `Invalid data: ${error.message}`;
  }
  if (error instanceof SchemaValidationError) {
    return `Invalid schema: ${error.message}`;
  }
  if (error instanceof NetworkError) {
    return 'Network error. Please check your connection and try again.';
  }
  if (error instanceof AuthError) {
    if (error.status === 401) {
      return 'Authentication required. Please check your GitHub token.';
    }
    if (error.status === 403) {
      return "Permission denied. You don't have access to this repository.";
    }
  }
  return `An unexpected error occurred: ${error.message}`;
}

export function logDetailedError(error, context = '') {
}

export function createPageNotFoundError(pageName) {
  return new PageNotFoundError(`Page '${pageName}' not found`);
}

export function createComponentNotFoundError(componentName) {
  return new ComponentNotFoundError(`Component '${componentName}' not found`);
}

export function createJSONParseError(originalError, content) {
  return new JSONParseError(originalError.message, content);
}

export function createValidationError(field, reason) {
  return new ValidationError(reason, field);
}

export function createSchemaValidationError(field, reason) {
  return new SchemaValidationError(reason, field);
}

export function createNetworkError(originalError) {
  return new NetworkError(originalError.message);
}

export function createAuthError(status, originalError) {
  return new AuthError(originalError.message, status);
}
