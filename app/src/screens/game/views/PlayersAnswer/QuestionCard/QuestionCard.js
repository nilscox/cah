// @flow

import * as React from 'react';
import { TouchableOpacity } from 'react-native';

import type { Question } from '~/redux/state/question';
import type { Choice } from '~/redux/state/choice';

import QuestionWebView from './QuestionWebView';
import styles from './QuestionCard.styles';

const COMPACT_TEXT_LENGTH = 200;

const totalTextLength = (question: Question, answer: Array<?Choice>) => {
  let total = 0;
  const add = (s: ?string) => {
    if (s)
      total += s.length;
  };

  question.split.forEach(add);
  answer.map(c => c && c.text).forEach(add);

  return total;
};

type QuestionCardProps = {
  question: Question,
  answer: Array<?Choice>,
  isSubmitted: boolean,
  onPress: Function,
};

const QuestionCard = ({ question, answer, isSubmitted, onPress }: QuestionCardProps) => {
  const compact = totalTextLength(question, answer) > COMPACT_TEXT_LENGTH;
  const fillIt = (function*() {
    if (!answer)
      return;

    for (let i = 0; i < answer.length; ++i)
      yield answer[i];
  })();

  const nextFill = () => fillIt.next().value;

  return (
    <TouchableOpacity style={[styles.wrapper, isSubmitted && styles.submitted]} onPress={onPress}>
      <QuestionWebView compact={compact} question={question} nextFill={nextFill} />
    </TouchableOpacity>
  );
}

QuestionCard.defaultProps = {
  answer: [],
};

export default QuestionCard;
