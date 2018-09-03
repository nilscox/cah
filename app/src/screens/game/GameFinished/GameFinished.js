import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { leaveGame } from 'Services/game-service';
import { getScoresFromHistory } from 'Services/math-service';

import screen from 'Screens/screen.styles';
import { ButtonPosition } from 'Components/Button';
import ScoreBoard from 'Components/ScoreBoard';



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
      this.props.onError('leaveGame', json);
  }

  render() {
    const { game, history } = this.props;

    if (this.state.back)
      return <Redirect to="/lobby" />;

    return (
      <View style={[screen.view, screen.viewPadding]}>

        <ScoreBoard scores={getScoresFromHistory(game, history)} />

        <Text style={styles.thankYou}>Thank you for playing!</Text>

        <ButtonPosition
          position="bottom"
          primary
          background
          title="back"
          onPress={() => this.leaveGame()}
        />

      </View>
    );
  }

}
