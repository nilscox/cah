import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger({
  collapsed: true,
  timestamp: true,
  diff: true,
  stateTransformer: state => state.toJSON(),
});

export default loggerMiddleware;
