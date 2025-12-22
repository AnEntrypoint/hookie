const PAT_KEY = 'github_token';
const API_BASE = 'https://api.github.com';

function getToken() {
  return localStorage.getItem(PAT_KEY) || '';
}

function getHeaders() {
  const token = getToken();
  return {
    'Authorization': token ? `token ${token}` : '',
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
}

async function apiCall(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers }
  });

  if (response.status === 404) throw new Error('404: Not found');
  if (response.status === 401) throw new Error('401: Authentication failed');
  if (response.status === 403) throw new Error('403: Access denied');
  if (response.status === 429) throw new Error('429: Rate limit exceeded');
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);

  return response.json();
}

export function getAuthToken() {
  return getToken();
}

export function logout() {
  localStorage.removeItem(PAT_KEY);
}

export async function getRepoStructure(owner, repo) {
  try {
    const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`);
    const structure = {};

    data.tree.forEach(item => {
      const dir = item.path.split('/').slice(0, -1).join('/') || '/';
      if (!structure[dir]) structure[dir] = [];
      structure[dir].push({
        name: item.path.split('/').pop(),
        path: '/' + item.path,
        type: item.type,
        sha: item.sha
      });
    });

    return structure;
  } catch (err) {
    throw err;
  }
}

export async function readFile(owner, repo, path) {
  try {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/contents/${cleanPath}`);
    const content = atob(data.content);

    return { content, sha: data.sha, path };
  } catch (err) {
    throw err;
  }
}

export async function writeFile(owner, repo, path, content, message, sha) {
  try {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/contents/${cleanPath}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: btoa(content),
        sha
      })
    });

    return { commit: data.commit, content: data.content };
  } catch (err) {
    throw err;
  }
}

export async function deleteFile(owner, repo, path, message, sha) {
  try {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/contents/${cleanPath}`, {
      method: 'DELETE',
      body: JSON.stringify({ message, sha })
    });

    return { commit: data.commit };
  } catch (err) {
    throw err;
  }
}

export async function getBranchInfo(owner, repo, branch = 'main') {
  try {
    const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/branches/${branch}`);

    return {
      name: data.name,
      commit: { sha: data.commit.sha, url: data.commit.url },
      protected: data.protected
    };
  } catch (err) {
    throw err;
  }
}

export async function getCommitHistory(owner, repo, path, limit = 20) {
  try {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/commits?path=${cleanPath}&per_page=${limit}`);

    return data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      html_url: commit.html_url
    }));
  } catch (err) {
    throw err;
  }
}

export async function compareCommits(owner, repo, base, head) {
  try {
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
  } catch (err) {
    throw err;
  }
}

export async function getUser() {
  try {
    const data = await apiCall(`${API_BASE}/user`);

    return {
      login: data.login,
      name: data.name,
      avatar_url: data.avatar_url,
      bio: data.bio
    };
  } catch (err) {
    throw err;
  }
}

export const github = {
  getAuthToken,
  logout,
  getRepoStructure,
  readFile,
  writeFile,
  deleteFile,
  getBranchInfo,
  getCommitHistory,
  compareCommits,
  getUser
};

export default github;
