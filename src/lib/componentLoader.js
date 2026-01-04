const _cache = new Map();
const _implementations = new Map();

export const componentLoader = {
  registerComponentImplementation(name, Component) {
    _implementations.set(name, Component);
    _cache.set(name, Component);
  },

  getComponentImplementation(name) {
    return _implementations.get(name) || _cache.get(name) || null;
  },

  getAll() {
    return Object.fromEntries(_implementations);
  },

  listLoaded() {
    return Array.from(_implementations.keys());
  },

  clear() {
    _cache.clear();
    _implementations.clear();
  },

  _cache,
  _implementations
};

export default componentLoader;
