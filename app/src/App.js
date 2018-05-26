// @flow

import * as React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { createLogger } from 'redux-logger';
import { createSwitchNavigator } from 'react-navigation';
import { composeWithDevTools } from 'redux-devtools-extension'

import initialState from './state';

import AuthScreen from './auth';
import LobbyScreen from './lobby';
import GameScreen from './game';

import { initialization } from '~/redux/actions';
import rootReducer from '~/redux/reducers';

/* eslint-disable no-console */
/* $FlowFixMe */
console.disableYellowBox = true;
/* eslint-enable no-console */

const loggerMiddleware = createLogger({
  collapsed: true,
  timestamp: true,
  diff: true,
});

const store = createStore(rootReducer, initialState, composeWithDevTools(
  applyMiddleware(
    thunkMiddleware,
    reduxPackMiddleware,
    loggerMiddleware,
  ),
));

const createWebSocket = (store) => {
  const socket = new WebSocket('ws://192.168.0.18:8000');

  socket.onopen = () => store.dispatch({
    type: 'WS_OPEN',
    socket,
  });

  socket.onmessage = (event: any) => store.dispatch({
    type: 'WS_MESSAGE',
    socket,
    event,
  });

  socket.onerror = (error: any) => store.dispatch({
    type: 'WS_ERROR',
    socket,
    error,
  });

  socket.onclose = (event: any) => store.dispatch({
    type: 'WS_CLOSE',
    socket,
    event,
  });
};

const init = (store) => {
  store.subscribe(() => {
    const { player, status } = store.getState();

    if (player && status.api == 'up' && status.websocket === 'closed')
      createWebSocket(store);
  });

  store.dispatch(initialization());
};

init(store);

const RootNavigator = createSwitchNavigator({
  Auth : { screen: AuthScreen },
  Lobby: { screen: LobbyScreen },
  Game : { screen: GameScreen },
}, {
  initialRouteName: 'Auth',
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

const App = () => (
  <Provider store={store}>
    <View style={styles.wrapper}>
      <StatusBar hidden={true} />
      <RootNavigator />
    </View>
  </Provider>
);

export default App;
