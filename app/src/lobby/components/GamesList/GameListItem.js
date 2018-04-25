// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { Game } from '../../../types/game';

type GameListItemPropsType = {
  game: Game,
};

const GameListItem = ({ game }: GameListItemPropsType) => (
  <View>
    <Text>Game {game.id}, owner: {game.owner}</Text>
  </View>
);

export default GameListItem;
