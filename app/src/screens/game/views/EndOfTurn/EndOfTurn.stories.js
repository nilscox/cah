/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { storiesOf, addDecorator } from '@storybook/react-native';

import EndOfTurn from './EndOfTurn';

addDecorator((story) => (
  <Provider store={createStore(a => a, require('./state'))}>
    {story()}
  </Provider>
));

storiesOf('EndOfTurn', module)
  .add('End of turn', () => <EndOfTurn />);
