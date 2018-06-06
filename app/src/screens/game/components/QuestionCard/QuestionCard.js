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
  const questionText = [];
  const questionBlanks = [];

  if (question.type === 'question') {
    questionText.push(<Text style={styles.question}>{question.text}</Text>);

    for (let i = 0; i < question.nb_choices; i++)
      questionBlanks.push(<Blank key={`blank-${i}`} />);
  } else {
    /* eslint-disable react/no-array-index-key */
    question.split.forEach((split, i) => {
      if (split)
        questionText.push(<Text key={`split-${i}`} style={styles.question}>{split}</Text>);
      else
        questionText.push(<Blank key={`blank-${i}`} />);
    });
    /* eslint-enable react/no-array-index-key */
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.question_text}>
        { questionText }
      </View>
      { questionBlanks.length > 0 &&
        <View style={styles.question_blanks}>
          { questionBlanks }
        </View>
      }
    </View>
  );
}

export default QuestionCard;
