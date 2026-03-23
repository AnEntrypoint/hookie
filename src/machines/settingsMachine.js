import { createMachine, assign } from 'xstate';

const TOKEN_RE = /^(ghp_[a-zA-Z0-9]{36,}|github_pat_[a-zA-Z0-9_]{22,})$/;

export const settingsMachine = createMachine({
  id: 'settings',
  initial: 'checking',
  context: {
    token: '',
    owner: '',
    repo: '',
    error: null,
    result: null,
    initDone: false,
  },
  states: {
    checking: {
      on: {
        HAS_CONFIG: { target: 'connected', actions: assign(({ event }) => ({ token: event.token, owner: event.owner, repo: event.repo })) },
        HAS_REPO: { target: 'tokenStep', actions: assign(({ event }) => ({ owner: event.owner, repo: event.repo })) },
        NO_CONFIG: 'tokenStep',
      },
    },
    tokenStep: {
      on: {
        SET_TOKEN: { actions: assign({ token: ({ event }) => event.token, error: null }) },
        NEXT: [
          {
            guard: ({ context }) => TOKEN_RE.test(context.token.trim()) && !!context.owner.trim() && !!context.repo.trim(),
            target: 'verifyStep',
            actions: assign({ error: null }),
          },
          {
            guard: ({ context }) => TOKEN_RE.test(context.token.trim()),
            target: 'repoStep',
            actions: assign({ error: null }),
          },
          {
            actions: assign({ error: 'Invalid token format. Tokens start with ghp_ or github_pat_.' }),
          },
        ],
      },
    },
    repoStep: {
      on: {
        SET_OWNER: { actions: assign({ owner: ({ event }) => event.owner, error: null }) },
        SET_REPO: { actions: assign({ repo: ({ event }) => event.repo, error: null }) },
        BACK: 'tokenStep',
        NEXT: [
          {
            guard: ({ context }) => !!context.owner.trim() && !!context.repo.trim(),
            target: 'verifyStep',
            actions: assign({ error: null }),
          },
          {
            actions: assign({ error: 'Owner and repository name are required.' }),
          },
        ],
      },
    },
    verifyStep: {
      on: {
        BACK: 'repoStep',
        VERIFY: 'verifying',
      },
    },
    verifying: {
      on: {
        VERIFY_SUCCESS: {
          target: 'connected',
          actions: assign({ result: ({ event }) => event.result, error: null }),
        },
        VERIFY_ERROR: {
          target: 'verifyStep',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    connected: {
      on: {
        EDIT: 'tokenStep',
        DISCONNECT: {
          target: 'tokenStep',
          actions: assign({ token: '', owner: '', repo: '', result: null, error: null, initDone: false }),
        },
        TEST_SUCCESS: { actions: assign({ result: ({ event }) => event.result, error: null }) },
        TEST_ERROR: { actions: assign({ error: ({ event }) => event.error }) },
        INIT_SUCCESS: { actions: assign({ initDone: true, error: null }) },
        INIT_ERROR: { actions: assign({ error: ({ event }) => event.error }) },
        CLEAR_ERROR: { actions: assign({ error: null }) },
      },
    },
  },
});
