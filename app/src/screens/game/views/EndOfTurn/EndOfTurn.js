// @flow

import * as React from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';

import type { Player } from '~/redux/state/player';
import { nextTurn } from '~/redux/actions/game';
import PlayerAvatar from '~/components/PlayerAvatar';

import styles from './EndOfTurn.styles';

type EndOfTurnProps = {
  winner: Player,
  canGoNext: boolean,
  nextTurn: Function,
};

const mapStateToProps = ({ player, game }) => {
  const turn = game.history[game.history.length - 1];
  const winner = game.players.find(p => p.nick === turn.winner);

  return {
    winner,
    canGoNext: true,
  };
};

const mapDispatchToProps = (dispatch) => ({
  nextTurn: () => dispatch(nextTurn()),
});

const EndOfTurn = ({ winner, canGoNext, nextTurn }: EndOfTurnProps) => (
  <View style={styles.wrapper}>

    <Image style={styles.crown} source={require('./crown.png')} />

    <PlayerAvatar style={styles.winner} player={winner} size="big" />

  </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(EndOfTurn);
