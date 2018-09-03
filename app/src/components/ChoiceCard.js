import * as React from 'react';
import { Text } from 'react-native';

/** ChoiceCard
props:
  - style
  - choice
*/

const ChoiceCard = ({ style, choice }) => (
  <Text style={style}>{ choice.text }</Text>
);

export default ChoiceCard;
