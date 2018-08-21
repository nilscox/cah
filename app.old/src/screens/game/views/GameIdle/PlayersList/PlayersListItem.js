// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { Player } from '~/redux/state/player';

type PlayersListItemProps = {
  player: Player,
};

const PlayersListItem = ({ player }: PlayersListItemProps) => (
  <View>
    <Text>{ player.nick }</Text>
  </View>
);

export default PlayersListItem;
