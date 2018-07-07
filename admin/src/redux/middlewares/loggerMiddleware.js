import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger({
  collapsed: true,
  timestamp: true,
  diff: true,
});

export default loggerMiddleware;
