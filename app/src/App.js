// @flow

import * as React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { createLogger } from 'redux-logger';
import { SwitchNavigator } from 'react-navigation';
import { composeWithDevTools } from 'redux-devtools-extension'

import AuthScreen, { reducer as authReducer } from './auth';
import LobbyScreen from './lobby';
import GameScreen from './game';

console.disableYellowBox = true;

const reducer = combineReducers({
  auth: authReducer,
});

const loggerMiddleware = createLogger({
  collapsed: true,
  timestamp: true,
  diff: true,
});

const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(
    reduxPackMiddleware,
    loggerMiddleware,
  ),
));

const RootNavigator = SwitchNavigator({
  Auth : AuthScreen,
  Lobby: LobbyScreen,
  Game : GameScreen,
}, {
  initialRouteName: 'Auth',
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default () => (
  <Provider store={store}>
    <View style={styles.wrapper}>
      <StatusBar hidden={true} />
      <RootNavigator />
    </View>
  </Provider>
);