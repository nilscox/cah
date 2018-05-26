// @flow

import * as React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
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
    promiseMiddleware,
    reduxPackMiddleware,
    loggerMiddleware,
  ),
));

store.dispatch(initialization());

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
