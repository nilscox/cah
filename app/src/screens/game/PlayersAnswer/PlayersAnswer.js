import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { submitAnswer } from '../../../services/game-service';

import QuestionCard from '../../../components/QuestionCard';
import ChoicesList from '../../../components/ChoicesList';

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  question: {
    flex: 1,
  },
  choices: {
    flex: 2,
  },
  questionSubmitted: {
    opacity: 0.8,
  },
});

export default class PlayersAnswer extends React.Component {

  state = {
    selection: null,
    submitted: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (state.selection !== null)
      return null;

    return {
      selection: Array(props.game.question.nbChoices).fill(null),
    };
  }

  toggleChoice(choice) {
    const selection = this.state.selection.slice();

    const idx = selection.findIndex(c => c && c.id === choice.id);

    if (idx >= 0) {
      selection[idx] = null;
    } else {
      const available = selection.findIndex(c => !c);

      if (available < 0)
        return;

      selection[available] = choice;
    }

    this.setState({ selection });
  }

  async submitAnswer() {
    const { game } = this.props;
    const { selection } = this.state;

    const { res, json } = await submitAnswer(game.id, selection);

    if (res.status === 200)
      this.setState({ submitted: true });
    else
      console.log(json);
  }

  render() {
    const { player, game } = this.props;
    const { selection, submitted } = this.state;

    const canSelect = !submitted && game.questionMaster !== player.nick;
    const canSubmit = !submitted && selection.filter(s => !s).length === 0;

    return (
      <View style={styles.view}>

        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => canSubmit && this.submitAnswer()}
        >
          <QuestionCard
            style={[styles.question, submitted && styles.questionSubmitted]}
            size="full"
            question={game.question}
            choices={selection}
          />
        </TouchableOpacity>

        <ChoicesList
          style={styles.choices}
          choices={player.cards}
          selection={selection}
          onChoicePress={choice => canSelect && this.toggleChoice(choice)}
        />

      </View>
    );
  }

}
