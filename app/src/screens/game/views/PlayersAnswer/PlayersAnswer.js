// @flow

import * as React from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

import type { Choice } from '~/redux/state/choice';
import type { Question } from '~/redux/state/question';
import { toggleChoice, submitAnswer } from '~/redux/actions';
import QuestionCard from '~/components/QuestionCard';
import ChoiceCard from '~/components/ChoiceCard';

import styles from './PlayersAnswer.styles';

type PlayersAnswerProps = {
  question: Question,
  cards: Array<Choice>,
  selectedChoices: Array<?Choice>,
  submittedAnswer: Array<Choice>,
  isSelected: (Choice) => boolean,
  canToggleChoice: (Choice) => boolean,
  canSubmitAnswer: boolean,
  toggleChoice: Function,
  submitAnswer: Function,
};

const COMPACT_TEXT_LENGTH = 200;

const totalQuestionTextLength = (question: Question, answer: Array<Choice>) => {
  let total = 0;
  const add = (s: ?string) => {
    if (s)
      total += s.length;
  };

  question.split.forEach(add);
  answer.map(c => c && c.text).forEach(add);

  return total;
};

const mapStateToProps = ({ player, game }) => {
  const isSelected = (choice) => player.selectedChoices
    .filter((c: ?Choice) => c && c.id === choice.id)
    .length > 0;

  const canToggleChoice = (choice) => {
    const selectedChoices = player.selectedChoices.filter(i => i !== null);

    if (player.submitted)
      return false;

    if (selectedChoices.length === game.question.nb_choices)
      return choice.isSelected;

    return true;
  };

  const selectedChoices = player.selectedChoices.filter(c => c !== null);
  const canSubmitAnswer = player.submitted === null
    && selectedChoices.length === game.question.nb_choices;

  return {
    question: game.question,
    cards: player.cards,
    selectedChoices: selectedChoices,
    submittedAnswer: player.submitted,
    isSelected,
    canToggleChoice,
    canSubmitAnswer,
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  toggleChoice: (choice) => dispatch(toggleChoice(choice)),
  submitAnswer: () => dispatch(submitAnswer()),
});

const PlayersAnswer = ({
  question,
  cards,
  selectedChoices,
  submittedAnswer,
  isSelected,
  canToggleChoice,
  canSubmitAnswer,
  toggleChoice,
  submitAnswer,
}: PlayersAnswerProps) => {
  const answers = submittedAnswer || selectedChoices;
  const textLength = totalQuestionTextLength(question, answers);
  const size = textLength > COMPACT_TEXT_LENGTH
    ? 'compact'
    : 'normal';

  return (
    <View style={styles.wrapper}>

      <View style={styles.question}>
        <QuestionCard
          size={size}
          question={question}
          answer={(submittedAnswer && submittedAnswer.answers) || selectedChoices}
          isSubmitted={submittedAnswer !== null}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayersAnswer);
