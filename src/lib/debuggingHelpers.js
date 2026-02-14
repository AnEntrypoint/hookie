import { KEYS } from '../admin/settingsStorage.js';

export const debugHelpers = {
  component: {
    get: (id) => {
      const comp = window.__debug?.state?.currentPage?.components?.find(c => c.id === id);
      console.log('Component:', comp);
      return comp;
    },
    schema: (type) => {
      const schema = window.__debug?.registry?.getComponent(type);
      console.log('Schema:', schema);
      return schema;
    },
    impl: (type) => {
      const impl = window.__debug?.loader?.getComponent(type);
      console.log('Implementation:', impl);
      return impl;
    },
    children: (id) => {
      const comp = debugHelpers.component.get(id);
      console.log('Children count:', comp?.children?.length || 0);
      return comp?.children || [];
    },
    props: (id) => {
      const comp = debugHelpers.component.get(id);
      console.log('Props:', comp?.props);
      return comp?.props;
    },
    style: (id) => {
      const comp = debugHelpers.component.get(id);
      console.log('Style:', comp?.style);
      return comp?.style;
    },
    find: (predicate) => {
      const comps = window.__debug?.state?.currentPage?.components || [];
      const result = comps.filter(predicate);
      console.log('Found:', result.length);
      return result;
    },
    findByType: (type) => debugHelpers.component.find(c => c.type === type),
    findByProp: (propName, propValue) => debugHelpers.component.find(c => c.props?.[propName] === propValue),
    all: () => window.__debug?.state?.currentPage?.components || [],
    count: () => {
      const count = window.__debug?.state?.currentPage?.components?.length || 0;
      console.log('Total components:', count);
      return count;
    }
  },

  state: {
    page: () => {
      console.log(JSON.stringify(window.__debug?.state?.currentPage, null, 2));
      return window.__debug?.state?.currentPage;
    },
    selected: () => {
      console.log('Selected:', window.__debug?.state?.selectedId);
      return window.__debug?.state?.selectedId;
    },
    unsaved: () => {
      console.log('Unsaved changes:', window.__debug?.state?.unsavedChanges);
      return window.__debug?.state?.unsavedChanges;
    },
    repo: () => {
      console.log('Repo:', window.__debug?.state?.repoInfo);
      return window.__debug?.state?.repoInfo;
    },
    sync: () => {
      console.log('Sync status:', window.__debug?.state?.syncStatus);
      return window.__debug?.state?.syncStatus;
    },
    route: () => {
      console.log('Current route:', window.__debug?.state?.currentRoute);
      return window.__debug?.state?.currentRoute;
    },
    error: () => {
      console.log('Page error:', window.__debug?.state?.pageError);
      return window.__debug?.state?.pageError;
    },
    all: () => {
      console.log(JSON.stringify(window.__debug?.state, null, 2));
      return window.__debug?.state;
    }
  },

  error: {
    list: (count = 10) => {
      const errors = window.__debug?.errors?.slice(-count) || [];
      console.table(errors.map(e => ({ level: e.level, message: e.message, time: new Date(e.timestamp).toLocaleTimeString() })));
      return errors;
    },
    last: () => {
      const err = window.__debug?.helpers?.getLastError?.();
      console.log('Last error:', JSON.stringify(err, null, 2));
      return err;
    },
    byLevel: (level) => {
      const errs = window.__debug?.helpers?.getErrorsByType?.(level) || [];
      console.log(`${level} errors:`, errs);
      return errs;
    },
    clear: () => {
      window.__debug?.helpers?.clearErrors?.();
      console.log('Errors cleared');
    },
    count: () => {
      const count = window.__debug?.errors?.length || 0;
      console.log('Total errors:', count);
      return count;
    }
  },

  drag: {
    state: () => {
      console.log('Drag state:', JSON.stringify(window.__debug?.drag, null, 2));
      return window.__debug?.drag;
    },
    active: () => {
      console.log('Is dragging:', window.__debug?.drag?.isActive);
      return window.__debug?.drag?.isActive;
    },
    dragged: () => {
      console.log('Dragged component:', window.__debug?.drag?.draggedId);
      return window.__debug?.drag?.draggedId;
    },
    hovered: () => {
      console.log('Hovered component:', window.__debug?.drag?.hoveredId);
      return window.__debug?.drag?.hoveredId;
    },
    target: () => {
      console.log('Drop target:', window.__debug?.drag?.targetParent);
      return window.__debug?.drag?.targetParent;
    },
    monitor: (intervalMs = 500) => {
      console.log('Monitoring drag state (press Escape to stop)...');
      const monitorId = setInterval(() => {
        const drag = window.__debug?.drag;
        console.log(new Date().toLocaleTimeString(), 'Active:', drag?.isActive, 'Dragged:', drag?.draggedId, 'Over:', drag?.hoveredId);
      }, intervalMs);
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          clearInterval(monitorId);
          console.log('Drag monitoring stopped');
        }
      }, { once: true });
    }
  },

  registry: {
    all: () => {
      const comps = window.__debug?.registry?.getAllComponents?.() || [];
      console.log('All components:', comps);
      return comps;
    },
    count: () => {
      const count = window.__debug?.registry?.getAllComponents?.()?.length || 0;
      console.log('Total registered:', count);
      return count;
    },
    custom: () => {
      const all = window.__debug?.registry?.getAllComponents?.() || [];
      const custom = all.filter(name => window.__debug?.loader?.getComponent(name));
      console.log('Custom components:', custom);
      return custom;
    },
    builtin: () => {
      const all = window.__debug?.registry?.getAllComponents?.() || [];
      const builtin = all.filter(name => !window.__debug?.loader?.getComponent(name));
      console.log('Built-in components:', builtin);
      return builtin;
    },
    schema: (name) => {
      const schema = window.__debug?.registry?.getComponent(name);
      console.log(`Schema for ${name}:`, schema);
      return schema;
    },
    props: (name) => {
      const schema = window.__debug?.registry?.getComponent(name);
      console.log(`Props for ${name}:`, schema?.props);
      return schema?.props;
    },
    children: (name) => {
      const schema = window.__debug?.registry?.getComponent(name);
      console.log(`Allowed children for ${name}:`, schema?.allowedChildren);
      return schema?.allowedChildren;
    }
  },

  loader: {
    loaded: () => {
      const names = window.__debug?.loader?.listLoaded?.() || [];
      console.log('Loaded custom components:', names);
      return names;
    },
    get: (name) => {
      const impl = window.__debug?.loader?.getComponent(name);
      console.log(`Implementation for ${name}:`, impl);
      return impl;
    },
    count: () => {
      const count = window.__debug?.loader?.listLoaded?.()?.length || 0;
      console.log('Total custom loaded:', count);
      return count;
    },
    cache: () => {
      console.log('Cache contents:', window.__debug?.loader?.cache);
      return window.__debug?.loader?.cache;
    }
  },

  logging: {
    enable: () => {
      if (window.__debug?.logging) window.__debug.logging.enabled = true;
      console.log('Logging enabled');
    },
    disable: () => {
      if (window.__debug?.logging) window.__debug.logging.enabled = false;
      console.log('Logging disabled');
    },
    verbose: () => {
      if (window.__debug?.logging) window.__debug.logging.verbose = true;
      console.log('Verbose logging enabled');
    },
    quiet: () => {
      if (window.__debug?.logging) window.__debug.logging.verbose = false;
      console.log('Verbose logging disabled');
    }
  },

  test: {
    setPage: (data) => {
      window.__debug?.testing?.setPageData?.(data);
      console.log('Page data set:', data);
    },
    selectComponent: (id) => {
      window.__debug?.testing?.setSelectedComponent?.(id);
      console.log('Selected component:', id);
    },
    selectByType: (type) => {
      window.__debug?.testing?.selectComponentByType?.(type);
      console.log('Selected first component of type:', type);
    }
  },

  check: {
    auth: () => {
      const repo = window.__debug?.state?.repoInfo;
      const token = localStorage.getItem(KEYS.token);
      console.log('Auth check:', {
        owner: repo?.owner || 'NOT SET',
        repo: repo?.repo || 'NOT SET',
        token: token ? 'SET' : 'NOT SET'
      });
      return { repo, token: !!token };
    },
    connectivity: () => {
      const online = window.__debug?.state?.syncStatus?.online;
      console.log('Online:', online);
      return online;
    },
    componentReady: (id) => {
      const comp = debugHelpers.component.get(id);
      const schema = comp ? window.__debug?.registry?.getComponent(comp.type) : null;
      const impl = comp ? window.__debug?.loader?.getComponent(comp.type) : null;
      const ready = !!(comp && schema && impl);
      console.log(`Component ${id} ready:`, ready, { comp: !!comp, schema: !!schema, impl: !!impl });
      return ready;
    },
    allComponentsReady: () => {
      const comps = window.__debug?.state?.currentPage?.components || [];
      const ready = comps.filter(c => {
        const schema = window.__debug?.registry?.getComponent(c.type);
        const impl = window.__debug?.loader?.getComponent(c.type);
        return schema && impl;
      });
      console.log(`Ready: ${ready.length}/${comps.length}`);
      return ready.length === comps.length;
    }
  }
};

export default debugHelpers;
