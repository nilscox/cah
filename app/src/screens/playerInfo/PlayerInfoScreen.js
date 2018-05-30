// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

import type { NavigationProps } from '~/types/navigation';

type PlayerInfoScreenProps = NavigationProps;

const PlayerInfoScreen = ({ navigation }: PlayerInfoScreenProps) => {
  const player = navigation.getParam('player');

  return (
    <View>
      <Text>PlayerInfoScreen</Text>
      <Text>{JSON.stringify(player)}</Text>
    </View>
  );
}

export default PlayerInfoScreen;
