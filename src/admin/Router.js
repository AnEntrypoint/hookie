export function parseRoute(hash) {
  if (!hash || hash === '#' || hash === '') {
    return { route: '/admin', params: {} };
  }

  // Remove leading #
  const path = hash.startsWith('#') ? hash.slice(1) : hash;
  const parts = path.split('/').filter(Boolean);

  // Handle different route patterns
  if (parts.length === 1 && parts[0] === 'admin') {
    return { route: '/admin', params: {} };
  }

  if (parts.length === 2 && parts[0] === 'admin') {
    return { route: `/admin/${parts[1]}`, params: {} };
  }

  if (parts.length === 3 && parts[0] === 'admin' && parts[1] === 'pages') {
    return { route: '/admin/pages/:pageName', params: { pageName: parts[2] } };
  }

  return { route: path, params: {} };
}

export function navigateTo(route) {
  window.location.hash = route;
}

export function getCurrentRoute() {
  return parseRoute(window.location.hash);
}

export function buildRoute(template, params = {}) {
  let route = template;
  for (const [key, value] of Object.entries(params)) {
    route = route.replace(`:${key}`, value);
  }
  return route;
}

export function matchesRoute(route, pattern) {
  const routeParts = route.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);

  if (routeParts.length !== patternParts.length) {
    return false;
  }

  return patternParts.every((part, i) => {
    return part.startsWith(':') || part === routeParts[i];
  });
}
