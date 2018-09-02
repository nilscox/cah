import * as React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

import { nextTurn } from '../../../services/game-service';

import screen from '../../screen.styles.js';
import AnswersList from '../../../components/AnswersList';


/** EndOfTurn
props:
  - player
  - game
*/

const styles = StyleSheet.create({
  question: {
    paddingHorizontal: 10,
    paddingBottom: 30,
    fontSize: 18,
  },
  next: {
    marginVertical: 20,
  },
  nextText: {
    textAlign: 'center',
  },
});

export default class EndOfTurn extends React.Component {

  async nextTurn() {
    const { game } = this.props;
    const { res, json } = await nextTurn(game.id);

    if (res.status === 200)
      ;
    else
      console.log(json);
  }

  render() {
    const { player, game } = this.props;

    const canGoNext = game.questionMaster === player.nick;

    return (
      <View style={screen.viewFull}>

        <Text style={screen.title}>End of turn</Text>

        { game.question.type === 'question' && (
          <Text style={styles.question}>{ game.question.text }</Text>
        ) }

        <AnswersList
          question={game.question}
          answers={game.propositions}
          winner={game.selectedAnswer.answeredBy}
          onAnswerPress={() => {}}
        />

        { canGoNext && (
          <TouchableOpacity style={styles.next} onPress={() => this.nextTurn()}>
            <Text style={styles.nextText}>NEXT</Text>
          </TouchableOpacity>
        ) }

      </View>
    );
  }

}
