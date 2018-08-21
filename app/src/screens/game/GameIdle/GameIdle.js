import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';


export default GameIdle = ({ game }) => (
  <View>
    <Text>Game #{game.id} idle</Text>
  </View>
);
