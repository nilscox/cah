// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import Button from '~/components/Button';
import { createGame } from './actions';

type CreateGameButtonProps = {
  createGame: Function,
};

const mapDispatchToProps = dispatch => ({
  createGame: () => dispatch(createGame()),
});

const CreateGameButton = ({ createGame }: CreateGameButtonProps) => (
  <Button variant="big" onPress={createGame} />
);

export default connect(null, mapDispatchToProps)(CreateGameButton);
