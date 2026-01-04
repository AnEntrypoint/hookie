const PAT_KEY = 'github_token';
const API_BASE = 'https://api.github.com';

function getToken() {
  return localStorage.getItem(PAT_KEY) || '';
}

function getHeaders() {
  const token = getToken();
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

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

export function getAuthToken() {
  return getToken();
}

export function logout() {
  localStorage.removeItem(PAT_KEY);
}

export async function getRepoStructure(owner, repo) {
  try {
    const structure = {};
    const dirs = ['content/pages', 'content/components', 'src/components'];

    for (const dir of dirs) {
      try {
        // Try unauthenticated API call first
        const response = await fetch(`${API_BASE}/repos/${owner}/${repo}/contents/${dir}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
            // No Authorization header for public repos
          }
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
  } catch (err) {
    throw err;
  }
}

export async function readFile(owner, repo, path) {
  try {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Read file from raw.githubusercontent.com (works for public repos without auth)
    const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${cleanPath}`);

    if (!response.ok) {
      throw new Error(`${response.status}: Not found`);
    }

    const content = await response.text();

    // Try to get SHA from API (for write operations), but don't fail if unavailable
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
    } catch (err) {
      // SHA not available, but content read succeeded
    }

    return { content, sha: sha || null, path };
  } catch (err) {
    throw err;
  }
}

export async function writeFile(owner, repo, path, content, message, sha) {
  try {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

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
      content: btoa(content)
    };

    if (currentSha) {
      body.sha = currentSha;
    }

    const data = await apiCall(`${API_BASE}/repos/${owner}/${repo}/contents/${cleanPath}`, {
      method: 'PUT',
      body: JSON.stringify(body)
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
