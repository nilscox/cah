// @flow

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import type { Choice } from '~/redux/state/choice';

import styles from './ChoiceCard.styles';

type ChoiceCardProps = {
  choice: Choice,
  onPress: Function,
};

const ChoiceCard = ({ choice, onPress }: ChoiceCardProps) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.wrapper}>
      <Text style={styles.choice}>{ choice.text }</Text>
    </View>
  </TouchableOpacity>
);

export default ChoiceCard;
