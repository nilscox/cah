import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';


/** Icon
props:
  - style
  - type
  - size
*/

/** IconButton
props:
  - onPress
  - ... Icon props
*/

/* eslint-disable react-native/no-unused-styles */
const styles = StyleSheet.create({
  small: {
    width: 16,
    height: 16,
  },
  medium: {
    width: 24,
    height: 24,
  },
});
/* eslint-enable react-native/no-unused-styles */

const IMAGES = {
  settings: require('Icons/settings.png'),
  profile: require('Icons/profile.png'),
  info: require('Icons/info.png'),
};

const Icon = ({ style, type, size }) => (
  <Image source={IMAGES[type]} style={[styles[size], style]} />
);

export default Icon;

export const IconButton = ({ onPress, ...props }) => (
  <TouchableOpacity onPress={onPress}>
    <Icon {...props} />
  </TouchableOpacity>
);
