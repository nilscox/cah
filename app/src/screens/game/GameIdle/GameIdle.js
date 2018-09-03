import * as React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

import { startGame } from 'Services/game-service';

import screen from 'Screens/screen.styles.js';
import Button from 'Components/Button';
import Player from 'Components/Player';


/** GameIdle
props:
  - player
  - game
*/

const styles = StyleSheet.create({
  waitMessage: {
    marginVertical: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  players: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  playerItem: {
    margin: 15,
  },
  startBtn: {
    alignItems: 'center',
  },
});

export default class GameIdle extends React.Component {

  async startGame() {
    const { res, json } = await startGame(this.props.game.id);

    if (res.status !== 200)
      this.props.onError('startGame', json);
  }

  render() {
    const { player, game } = this.props;

    return (
      <View style={[screen.view, screen.viewPadding]}>
        { this.renderPlayersList() }
        { player.nick === game.owner
          ? this.renderStartButton()
          : <Text style={styles.waitMessage}>Waiting for the game to start...</Text>
        }
      </View>
    );
  }

  renderPlayersList() {
    const { players } = this.props.game;

    return (
      <ScrollView contentContainerStyle={styles.players}>
        { players.map(player => (
          <Player
            key={player.nick}
            style={styles.playerItem}
            player={player}
          />
        )) }
      </ScrollView>
    );
  }

  renderStartButton() {
    return (
      <Button
        style={styles.startBtn}
        background
        primary
        title="start"
        onPress={() => this.startGame()}
      />
    );
  }

}
