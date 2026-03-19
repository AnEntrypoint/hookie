import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { createMachine, assign } from 'xstate';
import Renderer from './Renderer.js';
import { renderPageWithLayout, renderPage } from './WebJSXRenderer.js';
import contentManager from '../lib/contentManager.js';

const FALLBACK_PAGES = {
  about: {
    title: 'About', meta: { description: 'About our site' },
    components: [{ id: 'about-section', type: 'Section', props: { title: 'About Us' }, children: [{ id: 'about-text', type: 'Text', props: { content: 'This is a placeholder About page.' } }] }],
  },
  contact: {
    title: 'Contact', meta: { description: 'Contact us' },
    components: [{ id: 'contact-section', type: 'Section', props: { title: 'Contact Us' }, children: [{ id: 'contact-text', type: 'Text', props: { content: 'This is a placeholder Contact page.' } }] }],
  },
};

const routerMachine = createMachine({
  id: 'router',
  initial: 'loading',
  context: { currentPage: null, pageName: '', error: null, notFound: false },
  states: {
    loading: {
      on: {
        LOADED: { target: 'ready', actions: assign({ currentPage: ({ event }) => event.page, pageName: ({ event }) => event.name, error: null, notFound: false }) },
        NOT_FOUND: { target: 'notFound', actions: assign({ notFound: true, error: null }) },
        ERROR: { target: 'error', actions: assign({ error: ({ event }) => event.error }) },
      },
    },
    ready: {
      on: { NAVIGATE: 'loading' },
    },
    notFound: {
      on: { NAVIGATE: 'loading' },
    },
    error: {
      on: { NAVIGATE: 'loading' },
    },
  },
});

const Router = ({ owner, repo, defaultPage = 'home', layout }) => {
  const [state, send] = useMachine(routerMachine);
  const pageCacheRef = useRef({});
  const webjsxContainerRef = useRef(null);
  const [useWebJSX, setUseWebJSX] = useState(true);

  const getPageName = useCallback(() => {
    const hash = window.location.hash;
    const path = hash.replace(/^#\/?/, '') || defaultPage;
    const match = path.match(/pages\/(.+)$/);
    return match ? match[1] : path;
  }, [defaultPage]);

  const loadPage = useCallback(async () => {
    const pageName = getPageName();
    send({ type: 'NAVIGATE' });

    try {
      let pageData = pageCacheRef.current[pageName];
      if (!pageData) {
        pageData = await contentManager.loadPage(owner, repo, pageName);
        if (pageData) pageCacheRef.current[pageName] = pageData;
      }

      if (pageData) {
        send({ type: 'LOADED', page: pageData, name: pageName });
      } else if (FALLBACK_PAGES[pageName]) {
        send({ type: 'LOADED', page: FALLBACK_PAGES[pageName], name: pageName });
      } else {
        send({ type: 'NOT_FOUND' });
      }
    } catch (err) {
      if (FALLBACK_PAGES[getPageName()]) {
        send({ type: 'LOADED', page: FALLBACK_PAGES[getPageName()], name: getPageName() });
      } else {
        send({ type: 'ERROR', error: err.message });
      }
    }
  }, [owner, repo, getPageName, send]);

  useEffect(() => { loadPage(); }, [owner, repo, defaultPage]);
  useEffect(() => {
    const handler = () => loadPage();
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [loadPage]);

  useEffect(() => {
    if (state.context.currentPage?.title) document.title = state.context.currentPage.title;
  }, [state.context.currentPage]);

  useEffect(() => { window.scrollTo(0, 0); }, [state.context.currentPage]);

  useEffect(() => {
    if (useWebJSX && state.matches('ready') && webjsxContainerRef.current && state.context.currentPage) {
      try {
        if (layout) renderPageWithLayout(webjsxContainerRef.current, state.context.currentPage, layout);
        else renderPage(webjsxContainerRef.current, state.context.currentPage);
      } catch (e) {
        console.warn('WebJSX render failed, falling back to React:', e);
        setUseWebJSX(false);
      }
    }
  }, [state.context.currentPage, layout, useWebJSX]);

  if (state.matches('loading')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center">
        <div className="spinner w-9 h-9 border-3 border-border1 border-t-primary rounded-full mb-4" />
        <p className="text-content2">Loading page...</p>
      </div>
    );
  }

  if (state.matches('error')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-backgroundSecondary text-content2 flex items-center justify-center text-2xl font-bold mb-4">!</div>
        <h1 className="text-2xl font-bold text-content1 mb-2">Something went wrong</h1>
        <p className="text-sm text-content2 max-w-sm mb-6">{state.context.error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Reload</button>
      </div>
    );
  }

  if (state.matches('notFound')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-backgroundSecondary text-content2 flex items-center justify-center text-2xl font-bold mb-4">?</div>
        <h1 className="text-2xl font-bold text-content1 mb-2">Page not found</h1>
        <p className="text-sm text-content2 max-w-sm mb-6">This page does not exist or may have been moved.</p>
        <a href="#/" className="btn btn-primary">Go to home page</a>
      </div>
    );
  }

  if (state.matches('ready') && state.context.currentPage) {
    if (useWebJSX) {
      return <div ref={webjsxContainerRef} className="webjsx-root w-full" />;
    }
    return <Renderer pageData={state.context.currentPage} mode="view" layout={layout} />;
  }

  return null;
};

export default Router;
