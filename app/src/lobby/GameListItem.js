// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { Game } from '../types/game';

type GameListItemPropsType = {
  game: Game,
};

const GameListItem = (props: GameListItemPropsType) => (
  <View key={`game-item-${props.game.id}`}>
    <Text>Game {props.game.id}, owner: {props.game.owner}</Text>
  </View>
);

export default GameListItem;
