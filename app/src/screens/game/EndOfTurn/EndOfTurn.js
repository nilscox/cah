import * as React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

import { nextTurn } from '../../../services/game-service';

import screen from '../../screen.styles.js';
import AnswersList from '../../../components/AnswersList';
import { ButtonPosition } from '../../../components/Button';


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
});

export default class EndOfTurn extends React.Component {

  async nextTurn() {
    const { game } = this.props;
    const { res, json } = await nextTurn(game.id);

    if (res.status === 200)
      ;
    else
      this.props.onError('nextTurn', json);
  }

  render() {
    const { player, game } = this.props;

    const canGoNext = game.questionMaster === player.nick;

    return (
      <View style={screen.view}>

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
          <ButtonPosition
            position="bottom"
            background
            primary
            title="next"
            onPress={() => this.nextTurn()}
          />
        ) }

      </View>
    );
  }

}
