/**
 * AutoSaveManager
 *
 * Manages automatic saving of page data to localStorage with crash recovery.
 * Prevents data loss from browser crashes, network drops, or accidental closures.
 */

export class AutoSaveManager {
  constructor(pageName, saveInterval = 30000) {
    this.pageName = pageName;
    this.saveInterval = saveInterval;
    this.autoSaveKey = `autosave_${pageName}`;
    this.timeoutId = null;
    this.lastSavedState = null;
  }

  /**
   * Start auto-saving
   * @param {Function} getPageData - Function that returns current page data
   */
  start(getPageData) {
    // Save immediately
    this.save(getPageData());

    // Then save periodically
    this.timeoutId = setInterval(() => {
      this.save(getPageData());
    }, this.saveInterval);
  }

  /**
   * Save current state to localStorage
   * @param {Object} pageData - Current page data to save
   */
  save(pageData) {
    const state = {
      pageName: this.pageName,
      data: pageData,
      timestamp: Date.now(),
      version: 1
    };

    localStorage.setItem(this.autoSaveKey, JSON.stringify(state));
    this.lastSavedState = state;
  }

  /**
   * Restore auto-saved state from localStorage
   * @returns {Object|null} Parsed state or null if invalid/stale
   */
  restore() {
    const saved = localStorage.getItem(this.autoSaveKey);
    if (!saved) return null;

    try {
      const state = JSON.parse(saved);

      // Validate not stale (older than 24 hours)
      if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
        this.clear();
        return null;
      }

      return state;
    } catch (error) {
      console.warn('Failed to restore auto-save:', error);
      return null;
    }
  }

  /**
   * Clear auto-save from localStorage
   */
  clear() {
    localStorage.removeItem(this.autoSaveKey);
    this.lastSavedState = null;
  }

  /**
   * Stop auto-saving
   */
  stop() {
    if (this.timeoutId) {
      clearInterval(this.timeoutId);
    }
  }

  /**
   * Get formatted recovery information for UI display
   * @returns {Object|null} Recovery info or null if no valid save
   */
  getRecoveryInfo() {
    const saved = this.restore();
    if (!saved) return null;

    const age = Date.now() - saved.timestamp;
    const formatted = new Date(saved.timestamp).toLocaleString();

    return {
      timestamp: saved.timestamp,
      formatted,
      age,
      pageData: saved.data,
      isEmpty: !saved.data || saved.data.components.length === 0
    };
  }
}
