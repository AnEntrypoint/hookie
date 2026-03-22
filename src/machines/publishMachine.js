import { createMachine, assign } from 'xstate';

export const publishMachine = createMachine({
  id: 'publish',
  initial: 'idle',
  context: {
    commitMessage: '',
    error: null,
    lastCommit: null,
    expandedDiffs: [],
    publishProgress: null,
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
            guard: ({ context }) => !context.commitMessage || context.commitMessage.trim().length < 3,
            actions: assign({ error: 'Commit message must be at least 3 characters' }),
          },
          { target: 'publishing', actions: assign({ error: null, publishProgress: null }) },
        ],
      },
    },
    publishing: {
      on: {
        PROGRESS: {
          actions: assign({ publishProgress: ({ event }) => ({ current: event.current, total: event.total }) }),
        },
        SUCCESS: {
          target: 'success',
          actions: assign({ lastCommit: ({ event }) => event.commit, commitMessage: '', error: null, publishProgress: null }),
        },
        ERROR: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error, publishProgress: null }),
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
        RETRY: { target: 'publishing', actions: assign({ publishProgress: null }) },
      },
    },
  },
});
