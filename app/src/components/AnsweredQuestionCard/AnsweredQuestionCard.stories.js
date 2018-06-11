/* eslint-disable react-native/no-inline-styles */
// @flow

import * as React from 'react';
import { View } from 'react-native';
import { storiesOf, addDecorator } from '@storybook/react-native';
import { withKnobs, select, number } from '@storybook/addon-knobs';

import AnsweredQuestionCard from './AnsweredQuestionCard';

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

addDecorator((storyFn) => {
  const story = storyFn();
  const format = select('Format', ['question', 'end of turn'], 'question');

  if (format === 'question') {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          { story }
        </View>
        <View style={{ flex: 2 }} />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ height: 80 }}>
          { story }
        </View>
      </View>
    );
  }
});

addDecorator(withKnobs);

// const size = select('Size', ['normal', 'compact', 'tiny'], 'normal');

storiesOf('AnsweredQuestionCard', module)
  .add('Question 1', () => <AnsweredQuestionCard size={select('Size', ['normal', 'compact', 'tiny'], 'normal')} question={questions.question1} />)
  .add('Question 2', () => <AnsweredQuestionCard question={questions.question2} />)
  .add('Fill 1', () => <AnsweredQuestionCard question={questions.fill1} />)
  .add('Fill 2', () => <AnsweredQuestionCard question={questions.fill2} />)
  .add('Fill 3', () => <AnsweredQuestionCard question={questions.fill3} />);
