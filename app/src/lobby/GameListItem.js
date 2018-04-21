// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

const GameListItem = (props) => (
  <View key={`game-item-${props.id}`}>
    <Text>Game {props.id}, owner: {props.owner}</Text>
  </View>
);

export default GameListItem;
