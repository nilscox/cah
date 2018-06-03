// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { Question } from '~/redux/state/question';
import styles from './QuestionCard.styles';

type QuestionCardProps = {
  question: Question,
};

const Blank = () => (
  <View style={styles.blank} />
);

const QuestionCard = ({ question }: QuestionCardProps) => {
  const question_blanks = [];

  if (question.type === 'question') {
    for (let i = 0; i < question.nb_choices; i++)
      question_blanks.push(<Blank key={`blank-${i}`} />);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.question}>
        { question.text }
      </Text>
      { question_blanks.length > 0 &&
        <View style={styles.question_blanks}>
          { question_blanks }
        </View>
      }
    </View>
  );
}

export default QuestionCard;
