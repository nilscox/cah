// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { Question } from '~/redux/state/question';
import type { Choice } from '~/redux/state/choice';
import styles from './QuestionCard.styles';

type QuestionCardProps = {
  question: Question,
  answer: Array<?Choice>,
};

const Blank = () => (
  <View style={styles.blank} />
);

const Fill = ({ choice }: { choice: Choice }) => (
  <Text style={styles.fill}>{ choice.text }</Text>
);

const QuestionCard = ({ question, answer }: QuestionCardProps) => {
  const questionText = [];
  const questionBlanks = [];

  const fillIt = (function*() {
    if (!answer)
      return;

    for (let i = 0; i < answer.length; ++i)
      yield answer[i];
  })();
  const nextFill = () => fillIt.next().value;

  if (question.type === 'question') {
    questionText.push(<Text key="split" style={styles.question_text}>{question.text}</Text>);

    for (let i = 0; i < question.nb_choices; i++) {
      const fill = nextFill();

      if (fill)
        questionBlanks.push(<Fill key={`fill-${i}`} choice={fill} />);
      else
        questionBlanks.push(<Blank key={`blank-${i}`} />);
    }
  } else {
    for (let i = 0; i < question.split.length; i++) {
      const split = question.split[i];

      if (split)
        questionText.push(<Text key={`split-${i}`} style={styles.question_text}>{split}</Text>);
      else {
        const fill = nextFill();

        if (fill)
          questionText.push(<Fill key={`fill-${i}`} choice={fill} />);
        else
          questionText.push(<Blank key={`blank-${i}`} />);
      }
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.question}>
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

QuestionCard.defaultProps = {
  answer: null,
};

export default QuestionCard;
