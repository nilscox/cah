/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import PlayerAvatar from './PlayerAvatar';

const player = {
  nick: 'nils',
  avatar: null,
  connected: true,
};

storiesOf('PlayerAvatar', module)
  .addDecorator((story) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 50, backgroundColor: '#CFC' }}>
      { story() }
    </View>
  ))
  .add('default', () => (
    <PlayerAvatar player={player} />
  ))
  .add('small', () => (
    <PlayerAvatar player={player} size="small" />
  ))
  .add('big', () => (
    <PlayerAvatar player={player} size="big" />
  ));
