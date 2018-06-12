/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { View } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { storiesOf, addDecorator } from '@storybook/react-native';
import { withKnobs, select } from '@storybook/addon-knobs';

import type { Question } from '~/redux/state/question';
import type { Choice } from '~/redux/state/choice';
import EndOfTurn from './EndOfTurn';

const state = require('./state');

const store = createStore(a => a, state);

addDecorator(withKnobs);
addDecorator((story) => <Provider store={store}>{story()}</Provider>);

storiesOf('EndOfTurn', module)
  .add('End of turn', () => <EndOfTurn />);
