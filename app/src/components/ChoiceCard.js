import * as React from 'react';
import { Text } from 'react-native';

export default ChoiceCard = ({ style, choice }) => (
  <Text style={style}>{ choice.text }</Text>
);
