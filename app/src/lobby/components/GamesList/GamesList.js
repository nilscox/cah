// @flow

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import type { Game } from '~/types/game';
import GameListItem from './GameListItem';

type GamesListProps = {
  games: Array<Game>,
  joinGame: Function,
};

const styles = StyleSheet.create({
  joinGameText: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingBottom: 20,
    textAlign: 'center',
  },
});

const GamesList = ({ games, joinGame }: GamesListProps) => (
  <View>

    <Text style={styles.joinGameText}>Join a game</Text>

    { games.map((game, n) => (
      <GameListItem key={`game-${game.id}`} game={game} nth={n} joinGame={joinGame} />
    )) }

  </View>
);

export default GamesList;
