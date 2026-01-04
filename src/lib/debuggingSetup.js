import componentRegistry from './componentRegistry.js';
import componentLoader from './componentLoader.js';
import { debugHelpers } from './debuggingHelpers.js';

export function initializeDebugGlobals() {
  if (typeof window === 'undefined') return;

  window.__debug = {
    state: {
      pages: null,
      currentPage: null,
      selectedId: null,
      unsavedChanges: false,
      repoInfo: { owner: null, repo: null, token: null },
      currentRoute: null,
      syncStatus: { lastSync: null, online: true, hasRemoteChanges: false },
      pageError: null,
      changes: [],
      recoveryInfo: null
    },

    registry: {
      getAllComponents: () => componentRegistry.getAllComponents(),
      getComponent: (name) => componentRegistry.getComponent(name),
      canContainChild: (parent, child) => componentRegistry.canContainChild(parent, child),
      schemas: () => {
        const all = {};
        componentRegistry.getAllComponents().forEach(name => {
          all[name] = componentRegistry.getComponent(name);
        });
        return all;
      }
    },

    loader: {
      listLoaded: () => componentLoader.listLoaded(),
      getComponent: (name) => componentLoader.getComponentImplementation(name),
      cache: componentLoader._cache,
      implementations: componentLoader._implementations
    },

    drag: {
      isActive: false,
      draggedId: null,
      draggedType: null,
      hoveredId: null,
      targetParent: null,
      targetPosition: null
    },

    errors: [],

    logging: {
      enabled: true,
      verbose: false,
      log: (level, message, data) => {
        if (!window.__debug.logging.enabled) return;
        const timestamp = new Date().toISOString();
        const entry = { timestamp, level, message, data };
        window.__debug.errors.push(entry);
        if (window.__debug.errors.length > 100) {
          window.__debug.errors.shift();
        }
        if (level === 'error' || (window.__debug.logging.verbose && level !== 'debug')) {
          console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
        }
      }
    },

    testing: {
      setPageData: (data) => { window.__debug.state.currentPage = data; },
      setSelectedComponent: (id) => { window.__debug.state.selectedId = id; },
      selectComponentByType: (type) => {
        const pages = window.__debug.state.pages || [];
        for (const page of pages) {
          const found = findComponentByType(page, type);
          if (found) {
            window.__debug.state.selectedId = found.id;
            return found;
          }
        }
        return null;
      }
    },

    helpers: debugHelpers
  };

  function findComponentByType(pageData, type) {
    if (!pageData || !pageData.components) return null;
    const search = (components) => {
      for (const comp of components) {
        if (comp.type === type) return comp;
        if (comp.children && comp.children.length > 0) {
          const found = search(comp.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(pageData.components);
  }

  window.$d = debugHelpers;
  window.$state = window.__debug.state;
  window.$comp = debugHelpers.component;
  window.$err = debugHelpers.error;
  window.$drag = debugHelpers.drag;
  window.$check = debugHelpers.check;

  console.log('✓ Debug globals initialized');
  console.log('  Full API: window.__debug');
  console.log('  Quick aliases: $d (helpers), $state, $comp, $err, $drag, $check');
}

export function logDebug(message, data) {
  if (window.__debug?.logging) {
    window.__debug.logging.log('debug', message, data);
  }
}

export function logError(message, error) {
  if (window.__debug?.logging) {
    window.__debug.logging.log('error', message, error);
  }
}

export function logWarn(message, data) {
  if (window.__debug?.logging) {
    window.__debug.logging.log('warn', message, data);
  }
}

export function logInfo(message, data) {
  if (window.__debug?.logging) {
    window.__debug.logging.log('info', message, data);
  }
}

export function updateDebugState(updates) {
  if (window.__debug?.state) {
    Object.assign(window.__debug.state, updates);
  }
}

export function updateDragState(updates) {
  if (window.__debug?.drag) {
    Object.assign(window.__debug.drag, updates);
  }
}
