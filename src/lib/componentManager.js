import * as github from './github.js';

export async function loadComponentSchema(owner, repo, componentName) {
  try {
    const path = `content/components/${componentName}.json`;
    const { content } = await github.readFile(owner, repo, path);
    const schema = JSON.parse(content);
    return schema;
  } catch (error) {
    throw error;
  }
}

export async function saveComponentSchema(owner, repo, componentName, schema, commitMessage = '') {
  try {
    const path = `content/components/${componentName}.json`;
    const content = JSON.stringify(schema, null, 2);
    const message = commitMessage || `Save component schema: ${componentName}`;
    const result = await github.writeFile(owner, repo, path, content, message);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteComponentSchema(owner, repo, componentName, commitMessage = '') {
  try {
    const path = `content/components/${componentName}.json`;
    const message = commitMessage || `Delete component schema: ${componentName}`;
    const { sha } = await github.readFile(owner, repo, path);
    const result = await github.deleteFile(owner, repo, path, message, sha);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function listComponentSchemas(owner, repo) {
  try {
    const structure = await github.getRepoStructure(owner, repo);
    const componentFiles = (structure['content/components'] || [])
      .filter(file => file.name.endsWith('.json'))
      .map(file => file.name.replace('.json', ''))
      .sort();
    return componentFiles;
  } catch (error) {
    if (error.message?.includes('404')) {
      return [];
    }
    throw error;
  }
}
