// @flow

import * as React from 'react';
import { View } from 'react-native';

import type { NavigationPropsType } from '~/types/navigation';

type GameStatePropsType = {

};

type GamePropsType =
  & NavigationPropsType
  & GameStatePropsType;

class GameScreen extends React.Component<GamePropsType> {
  render() {
    return <View />;
  }
}

export default GameScreen;
