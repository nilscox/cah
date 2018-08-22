import * as React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

import { nextTurn } from '../../../services/game-service';

import AnswersList from '../../../components/AnswersList';

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  question: {
    height: 40,
    paddingHorizontal: 10,
    borderColor: '#999',
    borderBottomWidth: 1,
  },
  next: {
    marginTop: 40,
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
      <View style={styles.view}>
        <AnswersList
          question={game.question}
          answers={game.propositions}
          winner={game.selectedAnswer.answeredBy}
          onAnswerPress={() => canSelect && this.selectAnswer()}
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
