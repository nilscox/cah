import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers';
import {fetchPlayer, fetchGame, initializationFinished } from './actions';
import websocket, {send as wsSend} from './websocket';
import App from './App';

import './index.css';

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

websocket(store.dispatch);

let wsConnected = false;

store.subscribe(() => {
  if (wsConnected)
    return;

  const { player, wsState } = store.getState();

  if (wsState === 'connected' && player && player.nick) {
    wsSend({ action: 'connected', nick: player.nick });
    wsConnected = true;
  }
});

let gameFetched = false;

store.subscribe(() => {
  const state = store.getState();
  const loading = state.loading;

  if (!loading)
    return;

  const player = state.player;
  const game = state.game;

  if ((player && player.fetching) || (game && game.fetching))
    return;

  if (player) {
    if (!game && !gameFetched) {
      gameFetched = true;
      store.dispatch(fetchGame());
    } else
      store.dispatch(initializationFinished());
  } else
    store.dispatch(initializationFinished());
});

store.dispatch(fetchPlayer());

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));

registerServiceWorker();
