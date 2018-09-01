import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Redirect } from 'react-router-native';

import { leaveGame } from '../../../services/game-service';

import screen from '../../screen.styles';


/** GameFinished
props:
  - game
  - history

state:
  - back
*/

const styles = StyleSheet.create({
  thankYou: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 30,
  },
  backBtn: {
    alignItems: 'center',
  },
});

export default class GameFinished extends React.Component {

  state = {
    back: false,
  };

  async leaveGame() {
    const { game } = this.props;
    const { res, json } = await leaveGame(game.id);

    if (res.status === 204)
      this.setState({ back: true });
    else
      console.log(json);
  }

  render() {
    const { game, history } = this.props;

    if (this.state.back)
      return <Redirect to="/lobby" />;

    return (
      <View style={screen.view}>

        <Text style={screen.title}>Game #{game.id} finished</Text>
        <Text style={styles.thankYou}>Thank you for playing!</Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => this.leaveGame()}>
          <Text>BACK</Text>
        </TouchableOpacity>

      </View>
    );
  }

}
