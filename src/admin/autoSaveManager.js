export class AutoSaveManager {
  constructor(pageName, saveInterval = 30000) {
    this.pageName = pageName;
    this.saveInterval = saveInterval;
    this.autoSaveKey = `autosave_${pageName}`;
    this.timeoutId = null;
    this.lastSavedState = null;
  }

  start(getPageData) {
    this.save(getPageData());
    this.timeoutId = setInterval(() => this.save(getPageData()), this.saveInterval);
  }

  save(pageData) {
    const state = { pageName: this.pageName, data: pageData, timestamp: Date.now(), version: 1 };
    localStorage.setItem(this.autoSaveKey, JSON.stringify(state));
    this.lastSavedState = state;
  }

  restore() {
    const saved = localStorage.getItem(this.autoSaveKey);
    if (!saved) return null;
    try {
      const state = JSON.parse(saved);
      if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) { this.clear(); return null; }
      return state;
    } catch {
      return null;
    }
  }

  clear() {
    localStorage.removeItem(this.autoSaveKey);
    this.lastSavedState = null;
  }

  stop() {
    if (this.timeoutId) clearInterval(this.timeoutId);
  }

  getRecoveryInfo() {
    const saved = this.restore();
    if (!saved) return null;
    const age = Date.now() - saved.timestamp;
    return {
      timestamp: saved.timestamp,
      formatted: new Date(saved.timestamp).toLocaleString(),
      age,
      pageData: saved.data,
      isEmpty: !saved.data || !saved.data.components || saved.data.components.length === 0,
    };
  }
}
