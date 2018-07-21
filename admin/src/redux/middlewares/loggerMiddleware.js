import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger({
  collapsed: true,
  timestamp: true,
  diff: true,
  titleFormatter: action => action.type === 'WS_MESSAGE'
    ? 'WS_' + action.message.type
    : action.type,
});

export default loggerMiddleware;
