export * from './pageManager.js';
export * from './componentManager.js';
export * from './errorHandlers.js';

import * as pageManager from './pageManager.js';
import * as componentManager from './componentManager.js';
import * as errorHandlers from './errorHandlers.js';

export default {
  ...pageManager,
  ...componentManager,
  ...errorHandlers
};
