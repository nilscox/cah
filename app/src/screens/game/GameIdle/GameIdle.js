import * as React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'react-router-native';


export default GameIdle = ({ game }) => (
  <View>
    <Text>Game #{game.id} idle</Text>
    <Text>Players: { game.players.map(p => p.nick).join(', ') }</Text>
  </View>
);
