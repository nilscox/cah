// @flow

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { Game } from '~/redux/state/game';

import GameListItem from './GamesListItem';
import styles from './GamesList.styles';

type GamesListProps = {
  games: Array<Game>,
  reloadGamesList: Function,
  joinGame: Function,
};

const GamesList = ({ games, reloadGamesList, joinGame }: GamesListProps) => (
  <View style={styles.wrapper}>

    <View style={styles.joinGame}>
      <Text style={styles.joinGameText}>Join a game</Text>
      <TouchableOpacity onPress={reloadGamesList}>
        <Icon
          name="reload"
          style={styles.reloadIcon}
          size={20}
        />
      </TouchableOpacity>
    </View>

    { games.length
      ? games.map((game, n) => (
        <GameListItem key={`game-${game.id}`} game={game} nth={n} joinGame={joinGame} />
      ))
      : <Text style={styles.noGameText}>There is no game running right now, but you can create one!</Text>
    }

  </View>
);

export default GamesList;
