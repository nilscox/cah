import * as React from 'react';
import { Text } from 'react-native';

const ChoiceCard = ({ style, choice }) => (
  <Text style={style}>{ choice.text }</Text>
);

export default ChoiceCard;
