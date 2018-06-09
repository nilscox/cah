// @flow

import * as React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { createSwitchNavigator } from 'react-navigation';
import { MenuContext } from 'react-native-menu';
import { composeWithDevTools } from 'redux-devtools-extension'

import initialState from './redux/state';

import ApiDownScreen from './screens/apiDown';
import LoadingScreen from './screens/loading';
import AuthScreen from './screens/auth';
import LobbyScreen from './screens/lobby';
import GameScreen from './screens/game';

import loggerMiddleware from '~/redux/middlewares/loggerMiddleware';
import apiMiddleware from '~/redux/middlewares/apiMiddleware';
import { initialization } from '~/redux/actions';
import rootReducer from '~/redux/reducers';

/* eslint-disable no-console */
/* $FlowFixMe */
console.disableYellowBox = true;
/* eslint-enable no-console */

const store = createStore(rootReducer, initialState, composeWithDevTools(
  applyMiddleware(
    thunkMiddleware,
    promiseMiddleware,
    apiMiddleware,
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

const PageView = connect((s) => s)(({ status }) => {
  if (status.api === 'down')
    return <ApiDownScreen />;

  if (status.app === 'initializing')
    return <LoadingScreen />;

  return <RootNavigator />;
});

const App = () => (
  <Provider store={store}>
    <MenuContext style={styles.wrapper}>
      <StatusBar hidden />
      <PageView />
    </MenuContext>
  </Provider>
);

export default App;
