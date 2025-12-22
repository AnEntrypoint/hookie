export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  NOT_FOUND: '/404',
  ERROR: '/error'
};

export function getCurrentRoute() {
  let route = window.location.hash.slice(1) || window.location.pathname;
  
  if (route !== '/' && route.endsWith('/')) {
    route = route.slice(0, -1);
  }
  
  if (!route || route === '') {
    route = '/';
  }
  
  return route;
}

export function parseRoute(route) {
  const [path, queryString] = route.split('?');
  const params = {};
  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
  }
  
  let pageName = path === '/' ? 'home' : path.slice(1);
  pageName = pageName.replace(/^\/+|\/+$/g, '');
  
  return { path, pageName, params };
}

export function isAdminRoute(route = getCurrentRoute()) {
  return route.startsWith('/admin');
}

export function getPageNameFromRoute(route = getCurrentRoute()) {
  const { pageName } = parseRoute(route);
  return pageName || 'home';
}

export function getRouteFromPageName(pageName) {
  if (!pageName || pageName === 'home') {
    return '/';
  }
  return `/${pageName}`;
}

export function navigateToRoute(route) {
  window.location.hash = route;
}

export function navigateToPage(pageName) {
  const route = getRouteFromPageName(pageName);
  navigateToRoute(route);
}

export function addRouteChangeListener(callback) {
  const handler = () => {
    const route = getCurrentRoute();
    callback(route);
  };
  
  window.addEventListener('hashchange', handler);
  window.addEventListener('popstate', handler);
  
  return () => {
    window.removeEventListener('hashchange', handler);
    window.removeEventListener('popstate', handler);
  };
}
