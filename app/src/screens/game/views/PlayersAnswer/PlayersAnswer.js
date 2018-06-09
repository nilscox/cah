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
  isSelected: (Choice) => boolean,
  canToggleChoice: boolean,
  canSubmitAnswer: boolean,
  toggleChoice: Function,
  submitAnswer: Function,
};

const mapStateToProps = ({ player, game }) => ({
  question: game.question,
  cards: player.cards,
  selectedChoices: player.selectedChoices,
  isSelected: (choice) => player.selectedChoices.includes(choice),
  canToggleChoice: (() => {
    if (player.submitted)
      return false;

    if (player.selectedChoices.length === game.question.nb_choices)
      return false;

    return true;
  })(),
  canSubmitAnswer: (() => {
    if (player.submitted)
      return false;

    if (player.selectedChoices.length < game.question.nb_choices)
      return false;

    return true;
  })(),
});

const mapDispatchToProps = (dispatch) => ({
  toggleChoice: () => dispatch(toggleChoice()),
  submitAnswer: () => dispatch(submitAnswer()),
});

const PlayersAnswer = ({
  question,
  cards,
  isSelected,
  canToggleChoice,
  canSubmitAnswer,
  toggleChoice,
  submitAnswer,
}: PlayersAnswerProps) => {
  const renderChoice = ({ item: choice }: { item: Choice }) => (
    <ChoiceCard
      style={isSelected(choice) && styles.choiceSelected}
      choice={choice}
      onPress={() => canToggleChoice && toggleChoice(choice)}
    />
  );

  return (
    <View style={styles.wrapper}>

      <View style={styles.question}>
        <QuestionCard
          question={question}
          onPress={() => canSubmitAnswer && submitAnswer()}
        />
      </View>

      <View style={styles.choices}>
        <FlatList
          data={cards}
          keyExtractor={(card) => `card-${card.id}`}
          renderItem={renderChoice}
        />
      </View>

    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayersAnswer);
