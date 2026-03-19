import { createMachine, assign } from 'xstate';

const MAX_HISTORY = 50;

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export const builderMachine = createMachine({
  id: 'builder',
  initial: 'idle',
  context: {
    pageData: null,
    selectedComponentId: null,
    history: [],
    historyIndex: -1,
    paletteVisible: true,
    showMobilePropsPanel: false,
    screenSize: 'desktop',
  },
  on: {
    RESIZE: { actions: assign({ screenSize: ({ event }) => event.screenSize }) },
    TOGGLE_PALETTE: { actions: assign({ paletteVisible: ({ context }) => !context.paletteVisible }) },
    SET_PALETTE: { actions: assign({ paletteVisible: ({ event }) => event.visible }) },
    SHOW_MOBILE_PROPS: { actions: assign({ showMobilePropsPanel: true }) },
    HIDE_MOBILE_PROPS: { actions: assign({ showMobilePropsPanel: false }) },
  },
  states: {
    idle: {
      on: {
        INIT: {
          target: 'editing',
          actions: assign({
            pageData: ({ event }) => event.pageData,
            history: ({ event }) => [deepClone(event.pageData)],
            historyIndex: 0,
          }),
        },
      },
    },
    editing: {
      on: {
        SELECT: { actions: assign({ selectedComponentId: ({ event }) => event.id }) },
        DESELECT: { actions: assign({ selectedComponentId: null }) },
        UPDATE_PAGE: {
          actions: assign(({ context, event }) => {
            const newHistory = context.history.slice(0, context.historyIndex + 1);
            newHistory.push(deepClone(event.pageData));
            const trimmed = newHistory.length > MAX_HISTORY ? newHistory.slice(1) : newHistory;
            return {
              pageData: event.pageData,
              history: trimmed,
              historyIndex: trimmed.length - 1,
            };
          }),
        },
        UNDO: {
          guard: ({ context }) => context.historyIndex > 0,
          actions: assign(({ context }) => {
            const i = context.historyIndex - 1;
            return { historyIndex: i, pageData: deepClone(context.history[i]) };
          }),
        },
        REDO: {
          guard: ({ context }) => context.historyIndex < context.history.length - 1,
          actions: assign(({ context }) => {
            const i = context.historyIndex + 1;
            return { historyIndex: i, pageData: deepClone(context.history[i]) };
          }),
        },
        DELETE_COMPONENT: {
          actions: assign(({ context, event }) => {
            const cleared = context.selectedComponentId === event.id ? null : context.selectedComponentId;
            return { selectedComponentId: cleared };
          }),
        },
        EXTERNAL_UPDATE: {
          actions: assign(({ context, event }) => {
            if (JSON.stringify(event.pageData) === JSON.stringify(context.pageData)) return {};
            const newHistory = context.history.slice(0, context.historyIndex + 1);
            newHistory.push(deepClone(event.pageData));
            return {
              pageData: event.pageData,
              history: newHistory,
              historyIndex: newHistory.length - 1,
            };
          }),
        },
      },
    },
  },
});
