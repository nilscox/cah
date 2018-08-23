import * as React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

import { selectAnswer } from '../../../services/game-service';

import screen from '../../screen.styles.js';
import AnswersList from '../../../components/AnswersList';

const styles = StyleSheet.create({
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
      <View style={screen.viewFull}>
        <Text style={screen.title}>Question master selection</Text>
        <AnswersList
          question={game.question}
          answers={game.propositions}
          onAnswerPress={(answer) => canSelect && this.selectAnswer(answer)}
        />
      </View>
    );
  }

}
