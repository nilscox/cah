import * as React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

import { selectAnswer } from '../../../services/game-service';

import screen from '../../screen.styles.js';
import AnswersList from '../../../components/AnswersList';


/** QuestionMasterSelection
props:
  - player
  - game

state:
  - selected
*/

const styles = StyleSheet.create({
  question: {
    paddingHorizontal: 10,
    paddingBottom: 30,
    fontSize: 18,
  },
});

export default class QuestionMasterSelection extends React.Component {

  state = {
    selected: false,
  };

  async selectAnswer(answer) {
    const { game } = this.props;
    const { res, json } = await selectAnswer(game.id, answer);

    if (res.status === 200) {
      // that will never be true...
      if (game.playState === 'question_master_selection')
        this.setState({ selected: true });
    }
    else
      console.log(json);
  }

  render() {
    const { player, game } = this.props;
    const { selected } = this.state;

    const canSelect = !selected && game.questionMaster === player.nick;

    return (
      <View style={screen.view}>

        <Text style={screen.title}>Question master selection</Text>

        { game.question.type === 'question' && (
          <Text style={styles.question}>{ game.question.text }</Text>
        ) }

        <AnswersList
          question={game.question}
          answers={game.propositions}
          onAnswerPress={(answer) => canSelect && this.selectAnswer(answer)}
        />

      </View>
    );
  }

}
