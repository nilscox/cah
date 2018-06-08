// @flow

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import type { Choice } from '~/redux/state/choice';

type ChoiceCardProps = {
  choice: Choice,
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  choice: {
    fontSize: 16,
  },
});

const ChoiceCard = ({ choice }: ChoiceCardProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.choice}>{ choice.text }</Text>
  </View>
);

export default ChoiceCard;
