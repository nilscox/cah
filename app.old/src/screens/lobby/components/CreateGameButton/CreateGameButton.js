// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import Button from '~/components/Button';
import { createGame } from '~/redux/actions';

type CreateGameButtonProps = {
  createGame: Function,
};

const mapDispatchToProps = (dispatch: Function) => ({
  createGame: () => dispatch(createGame()),
});

const CreateGameButton = ({ createGame }: CreateGameButtonProps) => (
  <Button variant="big" onPress={createGame}>
    {'Create a new game'.toUpperCase()}
  </Button>
);

export default connect(null, mapDispatchToProps)(CreateGameButton);
