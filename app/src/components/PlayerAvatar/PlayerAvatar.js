// @flow

import * as React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import type { Player } from '~/redux/state/player';
import styles from './PlayerAvatar.styles.js'

type PlayerAvatarProps = {
  player: Player,
  style?: StyleSheet.Styles,
  size?: 'big' | 'small',
};

const defaultAvatar = require('./default-avatar.png');

const PlayerAvatar = ({ player, style, size }: PlayerAvatarProps) => {
  const wrapperStyles = {
    width: 42,
  };

  const imageStyles = {
    width: 42,
    height: 42,
    borderRadius: 21,
  };

  if (size === 'small') {
    wrapperStyles.width = imageStyles.width = imageStyles.height = 36;
    imageStyles.borderRadius = 18;
  }

  if (size === 'big') {
    wrapperStyles.width = imageStyles.width = imageStyles.height = 66;
    imageStyles.borderRadius = 33;
  }

  return (
    <View style={[wrapperStyles, style]}>
      <Image style={imageStyles} source={player.avatar || defaultAvatar} />
      <Text style={styles.nick}>{player.nick}</Text>
    </View>
  );
}

export default PlayerAvatar;
