/**
 * settingsStorage.js
 * Pure utility functions for GitHub settings localStorage operations
 * No React dependencies - can be used in any JavaScript context
 */

/**
 * Load GitHub settings from localStorage
 * @returns {Object} Settings object with token, owner, and repo properties
 */
export const loadSettingsFromStorage = () => {
  const token = localStorage.getItem('github_token') || '';
  const owner = localStorage.getItem('repo_owner') || '';
  const repo = localStorage.getItem('repo_name') || '';

  return {
    token,
    owner,
    repo
  };
};

/**
 * Save GitHub settings to localStorage
 * @param {string} token - GitHub personal access token
 * @param {string} owner - Repository owner username or organization
 * @param {string} repo - Repository name
 */
export const saveSettingsToStorage = (token, owner, repo) => {
  localStorage.setItem('github_token', token);
  localStorage.setItem('repo_owner', owner);
  localStorage.setItem('repo_name', repo);
};

/**
 * Clear all GitHub settings from localStorage
 */
export const clearSettingsFromStorage = () => {
  localStorage.removeItem('github_token');
  localStorage.removeItem('repo_owner');
  localStorage.removeItem('repo_name');
};
