import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';


export default PlayersAnswer = ({ game }) => (
  <View>
    <Text>Game #{game.id} started (players answer)</Text>
  </View>
);
