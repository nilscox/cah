/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react-native';

import EndOfTurn from './EndOfTurn';

storiesOf('EndOfTurn', module)
  .addDecorator((story) => (
    <Provider store={createStore(a => a, require('./state.question'))}>
      {story()}
    </Provider>
  ))
  .add('question', () => <EndOfTurn />);

storiesOf('EndOfTurn', module)
  .addDecorator((story) => (
    <Provider store={createStore(a => a, require('./state.fill'))}>
      {story()}
    </Provider>
  ))
  .add('fill', () => <EndOfTurn />);
