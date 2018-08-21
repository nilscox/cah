import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';


export default EndOfTurn = ({ game }) => (
  <View>
    <Text>Game #{game.id} started (end of turn)</Text>
  </View>
);
