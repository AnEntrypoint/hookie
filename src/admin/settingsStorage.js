export const KEYS = {
  token: 'github_token',
  owner: 'github_owner',
  repo: 'github_repo',
  lastPage: 'hookie_last_page',
};

const LEGACY_KEYS = {
  owner: ['repo_owner'],
  repo: ['repo_name'],
};

export const migrateStorageKeys = () => {
  for (const [field, oldKeys] of Object.entries(LEGACY_KEYS)) {
    const canonical = KEYS[field];
    if (localStorage.getItem(canonical)) continue;
    for (const oldKey of oldKeys) {
      const val = localStorage.getItem(oldKey);
      if (val) {
        localStorage.setItem(canonical, val);
        break;
      }
    }
  }
  for (const oldKeys of Object.values(LEGACY_KEYS)) {
    for (const k of oldKeys) localStorage.removeItem(k);
  }
};

export const loadSettingsFromStorage = () => ({
  token: localStorage.getItem(KEYS.token) || '',
  owner: localStorage.getItem(KEYS.owner) || '',
  repo: localStorage.getItem(KEYS.repo) || '',
});

export const saveSettingsToStorage = (token, owner, repo) => {
  localStorage.setItem(KEYS.token, token);
  localStorage.setItem(KEYS.owner, owner);
  localStorage.setItem(KEYS.repo, repo);
};

export const clearSettingsFromStorage = () => {
  localStorage.removeItem(KEYS.token);
  localStorage.removeItem(KEYS.owner);
  localStorage.removeItem(KEYS.repo);
};
