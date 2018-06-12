// @flow

import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import type { Player } from '~/redux/state/player';
import { startGame } from '~/redux/actions';

import PlayersList from './PlayersList';
import StartGameButton from './StartGameButton';
import styles from './GameIdle.styles';

type GameIdleProps = {
  players: Array<Player>,
  canStartGame: boolean,
  startGame: Function,
};

const mapStateToProps = ({ player, game }) => ({
  players: game.players,
  canStartGame: player.nick === game.owner,
});

const mapDispatchToProps = (dispatch: Function) => ({
  startGame: () => dispatch(startGame()),
});

const GameIdle = ({ players, canStartGame, startGame }: GameIdleProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.waitingText}>Waiting for the game to start...</Text>
    <PlayersList players={players} />
    { canStartGame && <StartGameButton startGame={startGame} /> }
  </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(GameIdle);
