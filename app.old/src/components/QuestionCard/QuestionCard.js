// @flow

import * as React from 'react';
import { TouchableOpacity } from 'react-native';

import type { Question } from '~/redux/state/question';
import type { Choice } from '~/redux/state/choice';

import QuestionWebView from './QuestionWebView';
import styles from './QuestionCard.styles';

type QuestionCardProps = {
  size?: 'normal' | 'compact' | 'tiny',
  question: Question,
  answer?: Array<?Choice>,
  isSubmitted: boolean,
  onPress: Function,
};

const QuestionCard = ({ size, question, answer, isSubmitted, onPress }: QuestionCardProps) => {
  const fillIt = (function*() {
    if (!answer)
      return;

    for (let i = 0; i < answer.length; ++i)
      yield answer[i];
  })();

  const nextFill = () => fillIt.next().value;

  return (
    <TouchableOpacity style={[styles.wrapper, isSubmitted && styles.submitted]} onPress={onPress}>
      <QuestionWebView size={size} question={question} nextFill={nextFill} />
    </TouchableOpacity>
  );
}

QuestionCard.defaultProps = {
  size: 'normal',
  answer: [],
};

export default QuestionCard;
