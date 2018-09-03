import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { submitAnswer } from '../../../services/game-service';
import { questionLength } from '../../../services/math-service';

import screen from '../../screen.styles.js';
import QuestionCard from '../../../components/QuestionCard';
import ChoicesList from '../../../components/ChoicesList';


/** PlayersAnswer
props:
  - player
  - game

state:
  - selection
  - submitted
*/

const styles = StyleSheet.create({
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

    if (props.player.submitted) {
      return {
        selection: props.player.submitted.choices,
        submitted: true,
      };
    }

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

    if (res.status === 200) {
      this.props.onAnswer(selection);

      if (game.playState === 'players_answer')
        this.setState({ submitted: true });
    } else
      this.props.onError('submitAnswer', json);
  }

  render() {
    const { player, game } = this.props;
    const { selection, submitted } = this.state;

    const canSelect = !submitted && game.questionMaster !== player.nick;
    const canSubmit = !submitted && selection.filter(s => !s).length === 0;

    const ql = questionLength(game.question, selection);
    const questionCss = {
      fontSize: ql < 140 ? 18 : 16,
      lineHeight: ql < 140 ? 26 : 18,
    };

    return (
      <View style={screen.view}>

        <TouchableOpacity
          onPress={() => canSubmit && this.submitAnswer()}
        >
          <QuestionCard
            style={[styles.question, submitted && styles.questionSubmitted]}
            size="full"
            question={game.question}
            choices={selection}
            cssStyles={questionCss}
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
