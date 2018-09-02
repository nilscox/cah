import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { ButtonPosition } from '../../../components/Button';
import { startGame } from '../../../services/game-service';

import screen from '../../screen.styles.js';


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
      <View style={[screen.view, screen.viewPadding]}>
        <Text>Players: { game.players.map(p => p.nick).join(', ') }</Text>
        { player.nick === game.owner
          ? this.renderStartButton()
          : <Text style={styles.waitMessage}>Waiting for the game to start...</Text>
        }
      </View>
    );
  }

  renderStartButton() {
    return (
      <ButtonPosition
        position="top"
        background
        primary
        title="start"
        onPress={() => this.startGame()}
      />
    );
  }

}
