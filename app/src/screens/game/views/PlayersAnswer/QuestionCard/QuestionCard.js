// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { Question } from '~/redux/state/question';
import type { Choice } from '~/redux/state/choice';
import styles from './QuestionCard.styles';

const COMPACT_TEXT_LENGTH = 300;

type QuestionCardProps = {
  question: Question,
  answer: Array<?Choice>,
};

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

const Split = ({ text, choice }: { text: ?string, choice: ?Choice }) => {
  if (!text && !choice)
    return <View style={styles.split_blank} />;

  const textStyles = [styles.split_text];
  let actualText = null;

  if (choice) {
    textStyles.push(styles.split_fill);
    actualText = choice.text;

    if (!choice.keepCapitalization)
      actualText = actualText.charAt(0).toLowerCase() + actualText.slice(1);
  } else if (text) {
    actualText = text;
  }

  return <Text style={textStyles}>{ actualText }</Text>;
};

Split.defaultProps = {
  text: null,
  choice: null,
}

const QuestionTypeQuestion = ({
  question,
  nextFill,
}: {
  question: Question,
  nextFill: Function,
}) => {
  const answer = [];

  for (let i = 0; i < question.nb_choices; i++) {
    const fill = nextFill();

    if (fill) {
      fill.keepCapitalization = true;
      answer.push(<Split key={`split-${i}`} choice={fill} />);
    }
    else
      answer.push(<Split key={`split-${i}`} />);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.question}>
        <Split text={question.text} />
      </View>
      <View style={styles.question_answer}>
        { answer }
      </View>
    </View>
  );
};

const QuestionTypeFill = ({
  question,
  nextFill,
}: {
  question: Question,
  nextFill: Function,
}) => {
  const text = [];
  let lastSplit = null;

  for (let i = 0; i < question.split.length; i++) {
    const split = question.split[i];

    if (split)
      text.push(<Split key={`split-${i}`} text={split} />);
    else {
      const fill = nextFill();

      if (fill) {
        if (i === 0 || (lastSplit && lastSplit.match(/\. */)))
          fill.keepCapitalization = true;

        text.push(<Split key={`split-${i}`} choice={fill} />);
      }
      else
        text.push(<Split key={`split-${i}`} />);
    }

    lastSplit = split;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.question}>
        { text }
      </View>
    </View>
  );
};

const QuestionCard = ({ question, answer }: QuestionCardProps) => {
  const compact = totalTextLength(question, answer) > COMPACT_TEXT_LENGTH;
  const fillIt = (function*() {
    if (!answer)
      return;

    for (let i = 0; i < answer.length; ++i)
      yield answer[i];
  })();

  const nextFill = () => fillIt.next().value;

  if (question.type === 'question')
    return <QuestionTypeQuestion question={question} nextFill={nextFill} />;
  else if (question.type === 'fill')
    return <QuestionTypeFill question={question} nextFill={nextFill} />;
  else
    throw new Error(`unkown question type: ${question.type}`);
}

QuestionCard.defaultProps = {
  answer: null,
};

export default QuestionCard;
