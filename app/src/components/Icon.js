import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';


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

const IMAGES = {
  settings: require('../icons/settings.png'),
  profile: require('../icons/profile.png'),
  info: require('../icons/info.png'),
};

export default Icon = ({ type, size, style }) => (
  <Image source={IMAGES[type]} style={[styles[size], style]} />
);

export const IconButton = ({ onPress, ...props }) => (
  <TouchableOpacity onPress={onPress}>
    <Icon {...props} />
  </TouchableOpacity>
);