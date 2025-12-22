import * as github from './github.js';

export async function loadPage(owner, repo, pageName) {
  try {
    const path = `content/pages/${pageName}.json`;
    const { content } = await github.readFile(owner, repo, path);
    const pageData = JSON.parse(content);
    return pageData;
  } catch (error) {
    throw error;
  }
}

export async function savePage(owner, repo, pageName, pageData, commitMessage = '') {
  try {
    const path = `content/pages/${pageName}.json`;
    const content = JSON.stringify(pageData, null, 2);
    const message = commitMessage || `Update page: ${pageName}`;
    const result = await github.writeFile(owner, repo, path, content, message);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deletePage(owner, repo, pageName, commitMessage = '') {
  try {
    const path = `content/pages/${pageName}.json`;
    const message = commitMessage || `Delete page: ${pageName}`;
    const { sha } = await github.readFile(owner, repo, path);
    const result = await github.deleteFile(owner, repo, path, message, sha);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function listPages(owner, repo) {
  try {
    const structure = await github.getRepoStructure(owner, repo);
    const pageFiles = (structure['content/pages'] || [])
      .filter(file => file.name.endsWith('.json'))
      .map(file => file.name.replace('.json', ''))
      .sort();
    return pageFiles;
  } catch (error) {
    if (error.message?.includes('404')) {
      return [];
    }
    throw error;
  }
}
