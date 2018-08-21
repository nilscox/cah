// @flow

import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import type { Choice } from '~/redux/state/choice';

import styles from './ChoiceCard.styles';

type ChoiceCardProps = {
  choice: Choice,
  isSelected: boolean,
  onPress: Function,
};

const ChoiceCard = ({ choice, isSelected, onPress }: ChoiceCardProps) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.wrapper, isSelected && styles.selected]}>
      <Text style={styles.choice}>{ choice.text }</Text>
    </View>
  </TouchableOpacity>
);

export default ChoiceCard;
