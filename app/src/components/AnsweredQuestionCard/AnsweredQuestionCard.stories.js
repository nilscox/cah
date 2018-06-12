/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { View } from 'react-native';
import { storiesOf, addDecorator } from '@storybook/react-native';
import { withKnobs, select } from '@storybook/addon-knobs';

import type { Question } from '~/redux/state/question';
import type { Choice } from '~/redux/state/choice';
import AnsweredQuestionCard from './AnsweredQuestionCard';
import { questions, answers } from './AnsweredQuestionCard.data';

addDecorator((story) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    {story()}
  </View>
));

addDecorator(withKnobs);

const aqc = (question: Question, answer: Array<Choice>) => (
  <AnsweredQuestionCard
    size={select('Size', ['normal', 'compact', 'tiny'], 'normal')}
    question={question}
    answer={answer}
  />
);

storiesOf('AnsweredQuestionCard', module)
  .add('Question short', () => aqc(questions.questionShort, [answers.answer1]))
  .add('Question long', () => aqc(questions.questionLong, [answers.answer2]))
  .add('Fill short', () => aqc(questions.fillShort, [answers.answer3]))
  // $FlowFixMe
  .add('Fill long', () => aqc(questions.fillLong, Object.values(answers)));
