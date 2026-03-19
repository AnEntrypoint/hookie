import { createMachine, assign } from 'xstate';

export const publishMachine = createMachine({
  id: 'publish',
  initial: 'idle',
  context: {
    commitMessage: '',
    error: null,
    lastCommit: null,
    expandedDiffs: [],
  },
  states: {
    idle: {
      on: {
        SET_MESSAGE: { actions: assign({ commitMessage: ({ event }) => event.message }) },
        TOGGLE_DIFF: {
          actions: assign({
            expandedDiffs: ({ context, event }) =>
              context.expandedDiffs.includes(event.path)
                ? context.expandedDiffs.filter(p => p !== event.path)
                : [...context.expandedDiffs, event.path],
          }),
        },
        SUBMIT: [
          {
            guard: ({ context }) => !context.commitMessage || context.commitMessage.trim().length < 10,
            target: 'error',
            actions: assign({ error: 'Commit message must be at least 10 characters' }),
          },
          { target: 'confirming' },
        ],
      },
    },
    confirming: {
      on: {
        CONFIRM: 'publishing',
        CANCEL: 'idle',
      },
    },
    publishing: {
      on: {
        SUCCESS: {
          target: 'success',
          actions: assign({ lastCommit: ({ event }) => event.commit, commitMessage: '', error: null }),
        },
        ERROR: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    success: {
      on: {
        DISMISS: { target: 'idle', actions: assign({ lastCommit: null }) },
      },
    },
    error: {
      on: {
        DISMISS: { target: 'idle', actions: assign({ error: null }) },
        RETRY: 'confirming',
      },
    },
  },
});
