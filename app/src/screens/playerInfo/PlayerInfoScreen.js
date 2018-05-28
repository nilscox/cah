import * as React from 'react';
import { View, Text } from 'react-native';

const PlayerInfoScreen = ({ navigation }) => {
  const player = navigation.getParam('player');

  return (
    <View>
      <Text>PlayerInfoScreen</Text>
      <Text>{JSON.stringify(player)}</Text>
    </View>
  );
}

export default PlayerInfoScreen;
