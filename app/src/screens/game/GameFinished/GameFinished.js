import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

import { leaveGame } from '../../../services/game-service';
import { getScoresFromHistory } from '../../../services/math-service';

import Button from '../../../components/Button';
import ScoreBoard from '../../../components/ScoreBoard';
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
  backBtnContainer: {
    flex: 1,
    marginVertical: 15,
    justifyContent: 'flex-end',
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

    const getTurnAnswer = turn => {
      const answer = turn.answers.find(a => a.answeredBy === turn.winner);

      answer.question = turn.question;

      return answer;
    };

    if (this.state.back)
      return <Redirect to="/lobby" />;

    return (
      <View style={screen.viewFull}>

        <Text style={screen.title}>Game #{game.id} finished</Text>
        <Text style={styles.thankYou}>Thank you for playing!</Text>

        { /* -> game info */}
        { /* <AnswersList answers={history.map(turn => Object.assign({}, getTurnAnswer(turn)))} /> */ }

        <ScoreBoard scores={getScoresFromHistory(game, history)} />

        <View style={styles.backBtnContainer}>
          <Button style={styles.backBtn} onPress={() => this.leaveGame()}>back</Button>
        </View>

      </View>
    );
  }

}
