// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from 'Reducers';
import { initialize } from 'Actions/initialization';
import App from './App';

const loggerMiddleware = createLogger({
  collapsed: true,
  duration: true,
  diff: true,
  colors: {
    title: action => {
      if (action.type === 'WEBSOCKET_MESSAGE')
        return 'royalblue';

      if (action.type.startsWith('WEBSOCKET_'))
        return 'steelblue';

      if (action.type.endsWith('_REQUEST'))
        return 'tan';

      if (action.type.endsWith('_SUCCESS'))
        return 'forestgreen';

      if (action.type.endsWith('_FAILURE'))
        return 'orangered';

      return 'dimgrey';
    }
  }
});

const store = createStore(
  rootReducer,
  applyMiddleware(
    promiseMiddleware,
    thunkMiddleware,
    loggerMiddleware,
  )
);

store.dispatch(initialize());

const root = document.getElementById('root');

if (!root)
  throw new Error('Cannot find #root');

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), root);

registerServiceWorker();
