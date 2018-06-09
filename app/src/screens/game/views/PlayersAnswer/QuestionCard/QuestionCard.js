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

const Split = ({ text, choice }: { text?: string, choice?: Choice }) => {
  if (choice) {
    let choiceText = choice.text;

    if (!choice.keepCapitalization)
      choiceText = choiceText.charAt(0).toLowerCase() + choiceText.slice(1);

    return (
      <Text style={[styles.split_text, styles.split_fill]}>
        { choiceText }
      </Text>
    );
  }
  else if (text)
    return <Text style={styles.split_text}>{ text }</Text>
  else
    return <View style={styles.split_blank} />
};

const QuestionTypeQuestion = ({ question, nextFill }: { question: Question, nextFill: Function }) => {
  const answer = [];

  for (let i = 0; i < question.nb_choices; i++) {
    const fill = nextFill();

    if (fill)
      answer.push(<Split key={`split-${i}`} choice={fill} />);
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

const QuestionTypeFill = ({ question, nextFill }: { question: Question, nextFill: Function }) => {
  const text = [];

  for (let i = 0; i < question.split.length; i++) {
    const split = question.split[i];

    if (split)
      text.push(<Split key={`split-${i}`} text={split} />);
    else {
      const fill = nextFill();

      if (fill)
        text.push(<Split key={`split-${i}`} choice={fill} />);
      else
        text.push(<Split key={`split-${i}`} />);
    }
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
  const textLength = totalTextLength(question, answer);
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
