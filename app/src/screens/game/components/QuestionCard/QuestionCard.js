// @flow

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import type { Question } from '~/redux/state/question';

type QuestionCardProps = {
  question: Question,
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 40,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    lineHeight: 25,
  },
});

const QuestionCard = ({ question }: QuestionCardProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.question}>{ question.text }</Text>
  </View>
);

export default QuestionCard;
