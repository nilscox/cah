// @flow

import * as React from 'react';
import { Button } from 'react-native';

type StartGameButtonProps = {
  startGame: Function,
};

const StartGameButton = ({ startGame }: StartGameButtonProps) => (
  <Button title="Start!" onPress={startGame} />
);

export default StartGameButton;
