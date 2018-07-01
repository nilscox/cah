// @flow

import * as React from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

import type { Choice } from '~/redux/state/choice';
import type { Question } from '~/redux/state/question';
import { toggleChoice, submitAnswer } from '~/redux/actions';
import QuestionCard from '~/components/QuestionCard';
import ChoiceCard from '~/components/ChoiceCard';
import selectors from '~/redux/selectors';

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

const mapStateToProps = (state) => ({
  question: selectors.gameQuestionSelector(state),
  cards: selectors.playerCardsSelector(state),
  selectedChoices: selectors.playerSelectedChoicesSelector(state),
  submittedAnswer: selectors.playerSubmittedAnswerSelector(state),
  isSelected: selectors.playerIsChoiceSelectedSelector(state),
  canToggleChoice: selectors.playerCanToggleChoice(state),
  canSubmitAnswer: selectors.playerSubmittedAnswerSelector(state),
});

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
  const answer = submittedAnswer || selectedChoices;
  const textLength = totalQuestionTextLength(question, answer);
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
