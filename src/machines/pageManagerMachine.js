import { createMachine, assign } from 'xstate';

export const pageManagerMachine = createMachine({
  id: 'pageManager',
  initial: 'loading',
  context: {
    pages: [],
    error: null,
    errorType: null,
    showForm: false,
    submitting: false,
  },
  states: {
    loading: {
      on: {
        LOADED: { target: 'ready', actions: assign({ pages: ({ event }) => event.pages, error: null, errorType: null }) },
        NO_REPO: { target: 'noRepo' },
        LOAD_ERROR: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error, errorType: ({ event }) => event.errorType }),
        },
      },
    },
    noRepo: {},
    ready: {
      on: {
        SHOW_FORM: { actions: assign({ showForm: true }) },
        HIDE_FORM: { actions: assign({ showForm: false }) },
        CREATE_START: { actions: assign({ submitting: true, error: null }) },
        CREATE_SUCCESS: {
          actions: assign({ showForm: false, submitting: false }),
        },
        CREATE_ERROR: {
          actions: assign({ error: ({ event }) => event.error, submitting: false }),
        },
        SET_ERROR: { actions: assign({ error: ({ event }) => event.error }) },
        CLEAR_ERROR: { actions: assign({ error: null }) },
        RELOAD: 'loading',
        PAGES_UPDATED: { actions: assign({ pages: ({ event }) => event.pages }) },
      },
    },
    error: {
      on: {
        RETRY: 'loading',
        CLEAR_ERROR: { target: 'ready', actions: assign({ error: null, errorType: null }) },
      },
    },
  },
});
