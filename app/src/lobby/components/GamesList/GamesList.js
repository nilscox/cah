// @flow

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import type { Game } from '../../../types/game';
import GameListItem from './GameListItem';

type GamesListProps = {
  games: Array<Game>,
};

const styles = StyleSheet.create({
  joinGameText: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingBottom: 20,
    textAlign: 'center',
  },
});

const GamesList = ({ games }: GamesListProps) => (
  <View>

    <Text style={styles.joinGameText}>Join a game</Text>

    { games.map((game, n) => (
      <GameListItem key={`game-${game.id}`} game={game} nth={n} />
    )) }

  </View>
);

export default GamesList;
