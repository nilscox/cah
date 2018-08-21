import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';


export default GameFinished = ({ game }) => (
  <View>
    <Text>Game #{game.id} finished</Text>
  </View>
);
