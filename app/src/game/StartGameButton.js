// @flow

import * as React from 'react';
import { Button } from 'react-native';

const StartGameButton = ({ startGame }) => (
  <Button title="Start!" onPress={startGame} />
);

export default StartGameButton;
