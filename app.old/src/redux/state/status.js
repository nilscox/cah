// @flow

export type Status = {
  app: 'initializing' | 'ready',
  api: 'up' | 'down',
  websocket: 'closed' | 'open',
};
