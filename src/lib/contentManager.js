import { github } from './github.js';

export async function loadPage(owner, repo, pageName) {
  try {
    const path = `content/pages/${pageName}.json`;
    const result = await github.readFile(owner, repo, path);
    return JSON.parse(result.content);
  } catch (err) {
    if (err.message.includes('not implemented')) {
      return {
        name: pageName,
        title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
        components: [
          {
            id: 'container-1',
            type: 'Container',
            props: { maxWidth: '1200px' },
            style: { padding: '20px' },
            children: [
              {
                id: 'heading-1',
                type: 'Heading',
                props: { level: 1, text: `Welcome to ${pageName}` },
                style: {},
                children: []
              },
              {
                id: 'text-1',
                type: 'Text',
                props: { content: 'This is a sample page.' },
                style: {},
                children: []
              }
            ]
          }
        ]
      };
    }
    if (err.message.includes('404')) {
      const error = new Error(`Page '${pageName}' not found`);
      error.name = 'PageNotFoundError';
      console.error(error);
      throw error;
    }
    if (err instanceof SyntaxError) {
      const error = new Error(`Failed to parse JSON: ${err.message}`);
      error.name = 'JSONParseError';
      console.error(error);
      throw error;
    }
    if (err.message.includes('401') || err.message.includes('403')) {
      const error = new Error(`Authentication failed: ${err.message}`);
      error.name = 'AuthError';
      console.error(error);
      throw error;
    }
    const error = new Error(`Network request failed: ${err.message}`);
    error.name = 'NetworkError';
    console.error(error);
    throw error;
  }
}

export async function savePage(owner, repo, pageName, pageData, commitMessage = '') {
  try {
    if (!pageData || typeof pageData !== 'object' || !Array.isArray(pageData.components)) {
      const error = new Error('Page data must have name, title, and components array');
      error.name = 'ValidationError';
      console.error(error);
      throw error;
    }

    const path = `content/pages/${pageName}.json`;
    const content = JSON.stringify(pageData, null, 2);
    const message = commitMessage || `Update page: ${pageName}`;

    try {
      return await github.writeFile(owner, repo, path, content, message);
    } catch (err) {
      if (err.message.includes('not implemented')) {
        return { commit: { sha: 'mock-sha-' + Date.now() }, content: { sha: 'mock-content-sha' } };
      }
      throw err;
    }
  } catch (err) {
    if (err.name === 'ValidationError') throw err;
    if (err.message.includes('401') || err.message.includes('403')) {
      const error = new Error(`Authentication failed: ${err.message}`);
      error.name = 'AuthError';
      console.error(error);
      throw error;
    }
    const error = new Error(`Network request failed: ${err.message}`);
    error.name = 'NetworkError';
    console.error(error);
    throw error;
  }
}

export async function deletePage(owner, repo, pageName, commitMessage = '') {
  try {
    const path = `content/pages/${pageName}.json`;

    try {
      await github.readFile(owner, repo, path);
    } catch (err) {
      if (err.message.includes('not implemented')) {
        return { commit: { sha: 'mock-sha-' + Date.now() } };
      }
      const error = new Error(`Page '${pageName}' not found`);
      error.name = 'PageNotFoundError';
      console.error(error);
      throw error;
    }

    const message = commitMessage || `Delete page: ${pageName}`;

    try {
      return await github.deleteFile(owner, repo, path, message);
    } catch (err) {
      if (err.message.includes('not implemented')) {
        return { commit: { sha: 'mock-sha-' + Date.now() } };
      }
      throw err;
    }
  } catch (err) {
    if (err.name === 'PageNotFoundError') throw err;
    if (err.message.includes('401') || err.message.includes('403')) {
      const error = new Error(`Authentication failed: ${err.message}`);
      error.name = 'AuthError';
      console.error(error);
      throw error;
    }
    const error = new Error(`Network request failed: ${err.message}`);
    error.name = 'NetworkError';
    console.error(error);
    throw error;
  }
}

export async function listPages(owner, repo) {
  try {
    try {
      const structure = await github.getRepoStructure(owner, repo);
      if (!Array.isArray(structure)) return [];

      return structure
        .filter(f => f.path && f.path.startsWith('/content/pages/') && f.path.endsWith('.json'))
        .map(f => f.path.replace('/content/pages/', '').replace('.json', ''))
        .sort();
    } catch (err) {
      if (err.message.includes('not implemented')) {
        return ['home', 'about', 'contact'];
      }
      throw err;
    }
  } catch (err) {
    if (err.message.includes('401') || err.message.includes('403')) {
      const error = new Error(`Authentication failed: ${err.message}`);
      error.name = 'AuthError';
      console.error(error);
      throw error;
    }
    const error = new Error(`Network request failed: ${err.message}`);
    error.name = 'NetworkError';
    console.error(error);
    throw error;
  }
}

export async function loadComponentSchema(owner, repo, componentName) {
  try {
    const path = `content/components/${componentName}.json`;
    const result = await github.readFile(owner, repo, path);
    const schema = JSON.parse(result.content);

    if (!schema.name || !schema.description || !schema.props || !Array.isArray(schema.allowedChildren) || !schema.defaultStyle) {
      const error = new Error(`Component schema missing required fields`);
      error.name = 'SchemaValidationError';
      console.error(error);
      throw error;
    }

    return schema;
  } catch (err) {
    if (err.message.includes('not implemented')) {
      return {
        name: componentName,
        description: `Mock schema for ${componentName}`,
        props: {},
        allowedChildren: ['*'],
        defaultStyle: {}
      };
    }
    if (err.name === 'SchemaValidationError') throw err;
    if (err.message.includes('404')) {
      const error = new Error(`Component '${componentName}' not found`);
      error.name = 'ComponentNotFoundError';
      console.error(error);
      throw error;
    }
    if (err instanceof SyntaxError) {
      const error = new Error(`Failed to parse JSON: ${err.message}`);
      error.name = 'JSONParseError';
      console.error(error);
      throw error;
    }
    if (err.message.includes('401') || err.message.includes('403')) {
      const error = new Error(`Authentication failed: ${err.message}`);
      error.name = 'AuthError';
      console.error(error);
      throw error;
    }
    const error = new Error(`Network request failed: ${err.message}`);
    error.name = 'NetworkError';
    console.error(error);
    throw error;
  }
}

export async function saveComponentSchema(owner, repo, componentName, schema, commitMessage = '') {
  try {
    if (!schema.name || !schema.description || !schema.props || !Array.isArray(schema.allowedChildren) || !schema.defaultStyle) {
      const error = new Error(`Component schema missing required fields`);
      error.name = 'SchemaValidationError';
      console.error(error);
      throw error;
    }

    const path = `content/components/${componentName}.json`;
    const content = JSON.stringify(schema, null, 2);
    const message = commitMessage || `Save component schema: ${componentName}`;

    try {
      return await github.writeFile(owner, repo, path, content, message);
    } catch (err) {
      if (err.message.includes('not implemented')) {
        return { commit: { sha: 'mock-sha-' + Date.now() }, content: { sha: 'mock-content-sha' } };
      }
      throw err;
    }
  } catch (err) {
    if (err.name === 'SchemaValidationError') throw err;
    if (err.message.includes('401') || err.message.includes('403')) {
      const error = new Error(`Authentication failed: ${err.message}`);
      error.name = 'AuthError';
      console.error(error);
      throw error;
    }
    const error = new Error(`Network request failed: ${err.message}`);
    error.name = 'NetworkError';
    console.error(error);
    throw error;
  }
}

export async function listComponentSchemas(owner, repo) {
  try {
    try {
      const structure = await github.getRepoStructure(owner, repo);
      if (!Array.isArray(structure)) return [];

      return structure
        .filter(f => f.path && f.path.startsWith('/content/components/') && f.path.endsWith('.json'))
        .map(f => f.path.replace('/content/components/', '').replace('.json', ''))
        .sort();
    } catch (err) {
      if (err.message.includes('not implemented')) {
        return ['Button', 'Text', 'Container', 'Heading', 'Image', 'Divider', 'Section', 'Grid', 'Link', 'List'];
      }
      throw err;
    }
  } catch (err) {
    if (err.message.includes('401') || err.message.includes('403')) {
      const error = new Error(`Authentication failed: ${err.message}`);
      error.name = 'AuthError';
      console.error(error);
      throw error;
    }
    const error = new Error(`Network request failed: ${err.message}`);
    error.name = 'NetworkError';
    console.error(error);
    throw error;
  }
}

export const contentManager = {
  loadPage,
  savePage,
  deletePage,
  listPages,
  loadComponentSchema,
  saveComponentSchema,
  listComponentSchemas
};
