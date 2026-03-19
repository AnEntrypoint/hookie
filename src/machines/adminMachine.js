import { createMachine, assign } from 'xstate';

export const adminMachine = createMachine({
  id: 'admin',
  initial: 'initializing',
  context: {
    repoInfo: { owner: '', repo: '' },
    currentPage: null,
    changes: [],
    layoutData: null,
    syncStatus: { lastSync: null, online: true, hasRemoteChanges: false },
    showNotification: false,
    successMessage: null,
    pageError: null,
    showWelcome: false,
    showPublishModal: false,
    currentRoute: { route: '', params: {} },
  },
  on: {
    ROUTE_CHANGED: { actions: assign({ currentRoute: ({ event }) => event.route }) },
    SET_REPO: {
      actions: assign({
        repoInfo: ({ event }) => event.repoInfo,
        showWelcome: false,
        successMessage: 'GitHub connection configured. Welcome to Hookie!',
      }),
    },
    SET_LAYOUT: { actions: assign({ layoutData: ({ event }) => event.layout }) },
    SHOW_NOTIFICATION: { actions: assign({ showNotification: true }) },
    DISMISS_NOTIFICATION: { actions: assign({ showNotification: false }) },
    DISMISS_SUCCESS: { actions: assign({ successMessage: null }) },
    SET_SUCCESS: { actions: assign({ successMessage: ({ event }) => event.message }) },
    TOGGLE_PUBLISH_MODAL: { actions: assign({ showPublishModal: ({ event }) => event.show }) },
    SYNC_REMOTE_CHANGES: {
      actions: assign({
        syncStatus: ({ context }) => ({ ...context.syncStatus, hasRemoteChanges: true }),
        showNotification: true,
      }),
    },
    REFRESH_COMPLETE: {
      actions: assign({
        showNotification: false,
        syncStatus: ({ context }) => ({ ...context.syncStatus, lastSync: Date.now(), hasRemoteChanges: false }),
      }),
    },
  },
  states: {
    initializing: {
      on: {
        INITIALIZED: [
          { guard: ({ event }) => !event.repoInfo.owner, target: 'welcome', actions: assign({ showWelcome: true }) },
          { target: 'ready', actions: assign({ repoInfo: ({ event }) => event.repoInfo }) },
        ],
      },
    },
    welcome: {
      on: {
        SET_REPO: { target: 'ready' },
      },
    },
    ready: {
      initial: 'pageManager',
      on: {
        NAVIGATE: [
          { guard: ({ event }) => event.route === '/admin' || event.route === '', target: '.pageManager' },
          { guard: ({ event }) => event.route === '/admin/settings', target: '.settings' },
          { guard: ({ event }) => event.route === '/admin/components', target: '.componentCreator' },
          { guard: ({ event }) => event.route === '/admin/library', target: '.library' },
          { guard: ({ event }) => event.route === '/admin/layout', target: '.layout' },
          { guard: ({ event }) => event.route?.startsWith('/admin/pages/'), target: '.pageEditor' },
        ],
        PAGE_LOADED: { actions: assign({ currentPage: ({ event }) => event.page, pageError: null }) },
        PAGE_ERROR: { actions: assign({ pageError: ({ event }) => event.error }) },
        PAGE_UPDATED: {
          actions: assign({
            currentPage: ({ context, event }) => ({ ...context.currentPage, data: event.pageData }),
            changes: ({ context, event }) => [
              ...context.changes.filter(c => c.path !== event.change.path),
              event.change,
            ],
          }),
        },
        PUBLISH_SUCCESS: { actions: assign({ changes: [], showPublishModal: false }) },
        CLEAR_PAGE_ERROR: { actions: assign({ pageError: null }) },
      },
      states: {
        pageManager: {},
        pageEditor: {},
        componentCreator: {},
        library: {},
        settings: {},
        layout: {},
      },
    },
  },
});
