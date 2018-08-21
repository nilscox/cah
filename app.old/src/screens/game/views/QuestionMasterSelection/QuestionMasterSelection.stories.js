/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react-native';

import QuestionMasterSelection from './QuestionMasterSelection';

storiesOf('QuestionMasterSelection', module)
  .addDecorator((story) => (
    <Provider store={createStore(a => a, require('./state'))}>
      {story()}
    </Provider>
  ))
  .add('QuestionMasterSelection', () => <QuestionMasterSelection />);
