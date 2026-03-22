import { KEYS } from '../admin/settingsStorage.js';

const API_BASE = 'https://api.github.com';

const getToken = () => localStorage.getItem(KEYS.token) || '';
const getHeaders = () => {
  const h = { 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };
  const t = getToken();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
};

async function apiCall(url, options = {}) {
  const token = getToken();
  if (!token && options.requireAuth !== false) {
    throw new Error('401: GitHub token not configured. Please set your token in Settings.');
  }

  const response = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers }
  });

  if (response.status === 404) throw new Error('404: Not found');
  if (response.status === 401) throw new Error('401: Authentication failed. Verify your token is valid.');
  if (response.status === 403) throw new Error('403: Access denied. Check repository permissions.');
  if (response.status === 429) throw new Error('429: Rate limit exceeded. Try again in a few minutes.');
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);

  return response.json();
}

function cleanFilePath(path) {
  return path.startsWith('/') ? path.substring(1) : path;
}

export function getAuthToken() {
  return getToken();
}

export function logout() {
  localStorage.removeItem(KEYS.token);
}

export async function getRepoStructure(owner, repo) {
  const structure = {};
  const dirs = ['content/pages', 'content/components', 'src/components'];

  for (const dir of dirs) {
    try {
      const response = await fetch(`${API_BASE}/repos/${owner}/${repo}/contents/${dir}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (response.ok) {
        const data = await response.json();
        structure[dir] = Array.isArray(data) ? data : [data];
      } else if (response.status === 404) {
        structure[dir] = [];
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      if (err.message?.includes('404')) {
        structure[dir] = [];
      } else {
        throw err;
      }
    }
  }

  return structure;
}

export async function readFile(owner, repo, path) {
  const cleanPath = cleanFilePath(path);
  const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${cleanPath}`);

  if (!response.ok) {
    throw new Error(`${response.status}: Not found`);
  }

  const content = await response.text();

  let sha = null;
  try {
    const token = getToken();
    if (token) {
      const apiResponse = await fetch(`${API_BASE}/repos/${owner}/${repo}/contents/${cleanPath}`, {
        headers: { ...getHeaders() }
      });
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        sha = data.sha;
      }
    }
  } catch (_) {}

  return { content, sha: sha || null, path };
}

export async function writeFile(owner, repo, path, content, message, sha) {
  const cleanPath = cleanFilePath(path);

  let currentSha = sha;
  if (!sha) {
    try {
      const existing = await apiCall(`${API_BASE}/repos/${owner}/${repo}/contents/${cleanPath}`);
      currentSha = existing.sha;
    } catch (err) {
      if (!err.message?.includes('404')) throw err;
      currentSha = undefined;
    }
  }

  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(content)))
  };

  if (currentSha) {
    body.sha = currentSha;
  }

  const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/contents/${cleanPath}`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });

  return { commit: data.commit, content: data.content };
}

export async function deleteFile(owner, repo, path, message, sha) {
  const cleanPath = cleanFilePath(path);
  const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/contents/${cleanPath}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha })
  });
  return { commit: data.commit };
}

export async function getBranchInfo(owner, repo, branch = 'main') {
  const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/branches/${branch}`);
  return {
    name: data.name,
    commit: { sha: data.commit.sha, url: data.commit.url },
    protected: data.protected
  };
}

export async function getCommitHistory(owner, repo, path, limit = 20) {
  const cleanPath = cleanFilePath(path);
  const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/commits?path=${cleanPath}&per_page=${limit}`);
  return data.map(commit => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author.name,
    date: commit.commit.author.date,
    html_url: commit.html_url
  }));
}

export async function compareCommits(owner, repo, base, head) {
  const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/compare/${base}...${head}`);
  return {
    files: data.files.map(file => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch
    }))
  };
}

export async function getUser() {
  const data = await apiCall(`${API_BASE}/user`);
  return {
    login: data.login,
    name: data.name,
    avatar_url: data.avatar_url,
    bio: data.bio
  };
}

export async function triggerWorkflow(owner, repo, workflowId, ref = 'main') {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`${API_BASE}/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ref })
    });
  } catch (_) {}
}

export default { getAuthToken, logout, getRepoStructure, readFile, writeFile, deleteFile, getBranchInfo, getCommitHistory, compareCommits, getUser, triggerWorkflow };
