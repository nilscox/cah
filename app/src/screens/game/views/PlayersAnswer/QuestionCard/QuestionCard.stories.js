/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import QuestionCard from './QuestionCard';

const questions = {
  question1: {
    id: 42,
    type: 'question',
    text: 'Do you like pie?',
    nb_choices: 1,
    split: ['Do you like pie?'],
  },
  question2: {
    id: 42,
    type: 'question',
    text: 'What\'s the best acolyte super-hero duo?',
    nb_choices: 2,
    split: ['What\'s the best acolyte super-hero duo?'],
  },
  fill1: {
    id: 42,
    type: 'fill',
    text: 'Do you like ?',
    nb_choices: 1,
    split: ['Do you like ', null, '?'],
  },
  fill2: {
    id: 42,
    type: 'fill',
    text: 'Sometimes, I put  in my .',
    nb_choices: 2,
    split: ['Sometimes, I put ', null, ' in my ', null, '.'],
  },
  fill3: {
    id: 42,
    type: 'fill',
    text: 'Sometimes, I put  in my  with .',
    nb_choices: 2,
    split: ['Sometimes, I put ', null, ' in my ', null, ' with ', null, '.'],
  },
};

const answers = {
  answer1: [{
    id: 42,
    text: 'Watermelon',
  }],
  answer2: [{
    id: 42,
    text: 'Watermelon',
  }, {
    id: 51,
    text: 'Fuck',
  }],
  answerNullAnswer: [{
    id: 42,
    text: 'Watermelon',
  }, null, {
    id: 51,
    text: 'Fuck',
  }],
}

storiesOf('QuestionCard', module)
  .addDecorator((story) => (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        { story() }
      </View>
      <View style={{ flex: 2 }} />
    </View>
  ))
  .add('Question 1', () => <QuestionCard question={questions.question1} />)
  .add('Question 2', () => <QuestionCard question={questions.question2} />)
  .add('Question with 1 answer', () => <QuestionCard question={questions.question1} answer={answers.answer1} />)
  .add('Question with 2 answers', () => <QuestionCard question={questions.question2} answer={answers.answer2} />)
  .add('Fill 1', () => <QuestionCard question={questions.fill1} />)
  .add('Fill 2', () => <QuestionCard question={questions.fill2} />)
  .add('Fill 3', () => <QuestionCard question={questions.fill3} />)
  .add('Fill with 1 answer', () => <QuestionCard question={questions.fill1} answer={answers.answer1} />)
  .add('Fill with 2 answers', () => <QuestionCard question={questions.fill3} answer={answers.answer2} />)
  .add('Fill with 2 answers 2', () => <QuestionCard question={questions.fill3} answer={answers.answerNullAnswer} />);
