// @flow

import * as React from 'react';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';

import type { Game } from '~/types/game';

type GameListItemPropsType = {
  game: Game,
  nth: number,
  joinGame: Function,
};

const styles = StyleSheet.create({
  game: {
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  even: {
    backgroundColor: '#F7F7F7',
  },
  odd: {
    backgroundColor: '#F0F0F0',
  },
});

const GameListItem = ({ game, nth, joinGame }: GameListItemPropsType) => (
  <TouchableHighlight onPress={() => joinGame(game.id)}>
    <View style={[styles.game, nth % 2 ? styles.even : styles.odd]}>
      <Text>Game {game.id}, owner: {game.owner}</Text>
    </View>
  </TouchableHighlight>
);

export default GameListItem;
