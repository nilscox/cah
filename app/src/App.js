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
import LobbyScreen, { reducer as lobbyReducer } from './lobby';
import GameScreen from './game';

/* eslint-disable no-console */
/* $FlowFixMe */
console.disableYellowBox = true;
/* eslint-enable no-console */

const reducer = combineReducers({
  auth: authReducer,
  lobby: lobbyReducer,
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
