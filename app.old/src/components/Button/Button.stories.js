/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import Button from './Button';

storiesOf('Button', module)
  .addDecorator((story) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 50 }}>
      { story() }
    </View>
  ))
  .add('default', () => (
    // TODO: check why flow is complaining
    <Button onPress={action('pressed')}>Click me!</Button>
  ))
  .add('big', () => (
    <Button onPress={action('pressed')} variant="big">Click me!</Button>
  ))
  .add('small', () => (
    <Button onPress={action('pressed')} variant="small">Click me!</Button>
  ));
