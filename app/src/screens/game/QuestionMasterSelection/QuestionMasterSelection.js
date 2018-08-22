import * as React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';

import { selectAnswer } from '../../../services/game-service';

import AnswersList from '../../../components/AnswersList';

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default class QuestionMasterSelection extends React.Component {

  state = {
    selected: false,
  };

  async selectAnswer(answer) {
    const { game } = this.props;
    const { res, json } = await selectAnswer(game.id, answer);

    if (res.status === 200)
      this.setState({ selected: true });
    else
      console.log(json);
  }

  render() {
    const { player, game } = this.props;
    const { selected } = this.state;

    const canSelect = !selected && game.questionMaster === player.nick;

    return (
      <View style={styles.view}>
        <AnswersList
          question={game.question}
          answers={game.propositions}
          onAnswerPress={(answer) => canSelect && this.selectAnswer(answer)}
        />
      </View>
    );
  }

}
