// @flow

import * as React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { createSwitchNavigator } from 'react-navigation';
import { composeWithDevTools } from 'redux-devtools-extension'

import initialState from './redux/state';

import ApiDownPage from './components/ApiDownPage';
import LoadingPage from './components/LoadingPage';

import AuthScreen from './auth';
import LobbyScreen from './lobby';
import GameScreen from './game';

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
    reduxPackMiddleware,
    apiMiddleware,
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
    return <ApiDownPage />;

  if (status.app === 'initializing')
    return <LoadingPage />;

  return <RootNavigator />;
});

const App = () => (
  <Provider store={store}>
    <View style={styles.wrapper}>
      <StatusBar hidden={true} />
      <PageView />
    </View>
  </Provider>
);

export default App;
