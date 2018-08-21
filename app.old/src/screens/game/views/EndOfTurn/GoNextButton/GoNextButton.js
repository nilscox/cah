// @flow

import * as React from 'react';

import Button from '~/components/Button';

import styles from './GoNextButton.styles';

type GoNextButtonProps = {
  winner: string,
  nextTurn: Function,
};

const GoNextButton = ({ winner, nextTurn }: GoNextButtonProps) => (
  <Button style={styles.button} onPress={nextTurn}>
    Give my card to {winner}
  </Button>
);

export default GoNextButton;
