// @flow

import * as React from 'react';
import { View } from 'react-native';

import type { Game } from '../../../types/game';
import GameListItem from './GameListItem';

type GamesListProps = {
  games: Array<Game>,
};

const GamesList = ({ games }: GamesListProps) => (
  <View>
    { games.map(game => (
      <GameListItem key={`game-${game.id}`} game={game} />
    )) }
  </View>
);

export default GamesList;
