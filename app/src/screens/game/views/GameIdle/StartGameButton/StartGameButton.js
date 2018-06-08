// @flow

import * as React from 'react';
import { Text } from 'react-native';

import Button from '~/components/Button';

type StartGameButtonProps = {
  startGame: Function,
};

const StartGameButton = ({ startGame }: StartGameButtonProps) => (
  <Button variant="big" onPress={startGame}>
    <Text>Start!</Text>
  </Button>
);

export default StartGameButton;
