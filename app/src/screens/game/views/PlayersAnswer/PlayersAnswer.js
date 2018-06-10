// @flow

import * as React from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

import type { Choice } from '~/redux/state/choice';
import type { Question } from '~/redux/state/question';
import { toggleChoice, submitAnswer } from '~/redux/actions';

import QuestionCard from './QuestionCard';
import ChoiceCard from './ChoiceCard';
import styles from './PlayersAnswer.styles';

type PlayersAnswerProps = {
  question: Question,
  cards: Array<Choice>,
  selectedChoices: Array<?Choice>,
  isSelected: (Choice) => boolean,
  canToggleChoice: (Choice) => boolean,
  canSubmitAnswer: boolean,
  toggleChoice: Function,
  submitAnswer: Function,
};

const mapStateToProps = ({ player, game }) => ({
  question: game.question,
  cards: player.cards,
  selectedChoices: player.selectedChoices,
  isSelected: (choice) => {
    return player.selectedChoices
      .filter((c: ?Choice) => c && c.id === choice.id)
      .length;
  },
  canToggleChoice: (choice) => {
    const selectedChoices = player.selectedChoices.filter(i => i !== null);

    if (player.submitted)
      return false;

    if (selectedChoices.length === game.question.nb_choices)
      return choice.isSelected;

    return true;
  },
  canSubmitAnswer: !player.submitted
    && player.selectedChoices.length === game.question.nb_choices,
});

const mapDispatchToProps = (dispatch) => ({
  toggleChoice: (choice) => dispatch(toggleChoice(choice)),
  submitAnswer: () => dispatch(submitAnswer()),
});

const PlayersAnswer = ({
  question,
  cards,
  selectedChoices,
  isSelected,
  canToggleChoice,
  canSubmitAnswer,
  toggleChoice,
  submitAnswer,
}: PlayersAnswerProps) => (
  <View style={styles.wrapper}>

    <View style={styles.question}>
      <QuestionCard
        question={question}
        answer={selectedChoices}
        onPress={() => canSubmitAnswer && submitAnswer()}
      />
    </View>

    <View style={styles.choices}>
      <FlatList
        data={cards.map(c => ({ ...c, isSelected: isSelected(c) }))}
        keyExtractor={(card) => `card-${card.id}`}
        renderItem={({ item: choice }) => (
          <ChoiceCard
            choice={choice}
            isSelected={choice.isSelected}
            onPress={() => canToggleChoice(choice) && toggleChoice(choice)}
          />
        )}
      />
    </View>

  </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(PlayersAnswer);
