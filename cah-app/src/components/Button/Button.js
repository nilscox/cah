// @flow

import * as React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#444484',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#747484',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'oxygen--bold',
    color: '#EEEEF3',
  },
  disabledText: {
    color: '#F2F2F3',
  },
});

const Button = ({ style, text, disabled, onPress }) => (
  <TouchableOpacity
    style={[style, styles.button, disabled && styles.disabled]}
    activeOpacity={disabled ? 1 : 0.8}
    onPress={(e) => !disabled && onPress(e)}
  >
    <Text style={[styles.buttonText, disabled && styles.disabledText]}>
      {text.toUpperCase()}
    </Text>
  </TouchableOpacity>
);

export default Button;
