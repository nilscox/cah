// @flow

export type status = {
  app: 'initializing' | 'ready',
  api: 'up' | 'down',
  websocket: 'closed' | 'open',
};
