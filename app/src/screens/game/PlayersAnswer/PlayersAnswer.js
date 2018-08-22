import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Redirect } from 'react-router-native';

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
});

export default class PlayersAnswer extends React.Component {

  state = {
    selection: null,
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

  render() {
    const { player, game } = this.props;
    const { selection } = this.state;

    return (
      <View style={styles.view}>

        <QuestionCard style={styles.question}
          size="big"
          question={game.question}
          choices={selection}
        />

        <ChoicesList
          style={styles.choices}
          choices={player.cards}
          selection={selection}
          onChoicePress={choice => this.toggleChoice(choice)}
        />

      </View>
    );
  }

}
