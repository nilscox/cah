import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Redirect } from 'react-router-native';

import { startGame } from '../../../services/game-service';

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginVertical: 30,
  },
  waitMessage: {
    marginVertical: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  startBtn: {
    marginVertical: 30,
    alignSelf: 'center',
  },
  startBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#EEE',
  },
});

export default class GameIdle extends React.Component {

  async startGame() {
    const { res, json } = await startGame(this.props.game.id);

    if (res.status !== 200)
      console.log(json);
  }

  render() {
    const { player, game } = this.props;

    return (
      <View style={styles.view}>
        <Text style={styles.title}>Game #{game.id}</Text>
        { player.nick === game.owner
          ? this.renderStartButton()
          : <Text style={styles.waitMessage}>Waiting for the game to start...</Text>
        }
        <Text>Players: { game.players.map(p => p.nick).join(', ') }</Text>
      </View>
    );
  }

  renderStartButton() {
    return (
      <TouchableOpacity style={styles.startBtn} onPress={() => this.startGame()}>
        <Text style={styles.startBtnText}>START</Text>
      </TouchableOpacity>
    );
  }

}
