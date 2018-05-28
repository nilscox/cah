import { createLogger } from 'redux-logger';

const getActionType = (action) => {
  if (action.meta && action.meta['redux-pack/TRANSACTION'])
    return 'REQUEST';

  if (action.socket instanceof WebSocket)
    return 'SOCKET';
};

const loggerMiddleware = createLogger({
  collapsed: true,
  timestamp: true,
  diff: true,
  titleFormatter: (action) => {
    const type = getActionType(action) || 'ACTION';

    // TODO
    /* eslint-disable-next-line no-unused-vars */
    const getColor = () => {
      switch (type) {
        case 'REQUEST':
          switch(action.meta['redux-pack/LIFECYCLE']) {
            case 'start':
              return 'tan';
            case 'success':
              return 'forestgreen';
            case 'failure':
              return 'orangered';
            default:
              throw new Error('Unknown redux-pack lifecycle');
          }

        case 'SOCKET':
          if (action.type === 'WEBSOCKET_MESSAGE')
            return 'royalblue';
          else
            return 'steelblue';

        default:
          return 'dimgrey';
      }
    };

    const getTag = () => type.padEnd(7, ' ');

    const getMessage = () => {
      if (action.meta && action.meta['redux-pack/LIFECYCLE'])
        return action.meta['redux-pack/LIFECYCLE'];

      if (action.type === 'WEBSOCKET_MESSAGE')
        return action.message.type;

      return '';
    };

    return `[${getTag()}][${action.type}] ${getMessage()}`;
  },
});

export default loggerMiddleware;
