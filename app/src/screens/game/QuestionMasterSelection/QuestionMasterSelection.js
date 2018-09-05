import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { selectAnswer } from 'Services/game-service';

import screen from 'Screens/screen.styles.js';
import AnswersList from 'Components/AnswersList';


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
      // that should never be true...
      if (json.playState === 'question_master_selection')
        this.setState({ selected: true });
    }
    else
      this.props.onError('selectAnswer', json);
  }

  render() {
    const { player, game } = this.props;
    const { selected } = this.state;

    const canSelect = !selected && game.questionMaster === player.nick;

    return (
      <View style={screen.view}>

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
