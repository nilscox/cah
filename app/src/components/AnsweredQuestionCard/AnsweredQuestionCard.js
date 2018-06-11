// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { Question } from '~/redux/state/question';
import type { Choice } from '~/redux/state/choice';
import QuestionCard from '~/components/QuestionCard';

import styles from './AnsweredQuestionCard.styles';

type AnsweredQuestionCardProps = {
  question: Question,
  answer: Array<Choice>,
};

const AnsweredQuestionCard = ({ question, answer }: AnsweredQuestionCardProps) => {
  if (question.type === 'question') {
    return (
      <View style={styles.wrapper}>
        { answer.map((choice) => (
          <Text key={`choice-${choice.id}`} style={styles.answerText}>{ choice.text }</Text>
        )) }
      </View>
    );
  } else {
    return (
      <View style={styles.wrapper}>
        <QuestionCard size="tiny" question={question} answer={answer} />
      </View>
    );
  }
};

export default AnsweredQuestionCard;
