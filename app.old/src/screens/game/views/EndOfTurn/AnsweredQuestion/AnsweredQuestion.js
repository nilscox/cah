// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { AnsweredQuestion } from '~/redux/state/answeredQuestion';

import styles from './AnsweredQuestion.styles';

type AnsweredQuestionProps = {
  answer: AnsweredQuestion,
};

const AnsweredQuestionComponent = ({ answer }: AnsweredQuestionProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.text}>{answer.answered_by}</Text>
  </View>
);

export default AnsweredQuestionComponent;
