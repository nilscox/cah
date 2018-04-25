// @flow

import * as React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';

import { createGame } from './actions';

type CreateGameButtonProps = {
  createGame: Function,
};

const mapDispatchToProps = dispatch => ({
  createGame: () => dispatch(createGame()),
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#C9C9C9',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
});

const CreateGameButton = ({ createGame }: CreateGameButtonProps) => (
  <TouchableOpacity
    style={[styles.button]}
    onPress={createGame}
  >
    <Text style={[styles.buttonText]}>
      Create a new game
    </Text>
  </TouchableOpacity>
);

export default connect(null, mapDispatchToProps)(CreateGameButton);
