// @flow

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import type { Game } from '~/redux/state/game';
import GameListItem from './GamesListItem';

type GamesListProps = {
  games: Array<Game>,
  joinGame: Function,
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 35,
  },
  joinGameText: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingBottom: 20,
    textAlign: 'center',
  },
  noGameText: {
    textAlign: 'center',
  },
});

const GamesList = ({ games, joinGame }: GamesListProps) => (
  <View style={styles.wrapper}>

    <Text style={styles.joinGameText}>Join a game</Text>

    { games.length
      ? games.map((game, n) => (
        <GameListItem key={`game-${game.id}`} game={game} nth={n} joinGame={joinGame} />
      ))
      : <Text style={styles.noGameText}>There is no game running right now, but you can create one!</Text>
    }

  </View>
);

export default GamesList;
