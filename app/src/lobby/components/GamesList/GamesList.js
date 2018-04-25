// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import type { Game } from '../../../types/game';
import GameListItem from './GameListItem';

type GamesListProps = {
  games: Array<Game>,
};

const styles = StyleSheet.create({

});

const GamesList = ({ games }: GamesListProps) => (
  <View style={styles.list}>
    { games.map((game, n) => (
      <GameListItem key={`game-${game.id}`} game={game} nth={n} />
    )) }
  </View>
);

export default GamesList;
