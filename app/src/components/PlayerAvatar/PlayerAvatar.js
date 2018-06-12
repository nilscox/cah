// @flow

import * as React from 'react';
import { View, Image, Text } from 'react-native';

import type { Player } from '~/redux/state/player';
import type { Style } from '~/types/style';
import styles from './PlayerAvatar.styles.js'

type PlayerAvatarProps = {
  player: Player,
  style?: ?Style,
  size?: 'big' | 'normal' | 'small',
  showNick?: boolean,
};

const defaultAvatar = require('./default-avatar.png');

const PlayerAvatar = ({ player, style, size, showNick }: PlayerAvatarProps) => {
  if (!size) return;

  const imageSize = {
    small: 36,
    normal: 42,
    big: 66,
  }[size];

  const imageBorderRadius = {
    small: 18,
    normal: 21,
    big: 33,
  }[size];

  const wrapperStyles = {
    width: imageSize,
  };

  const imageStyles = {
    width: imageSize,
    height: imageSize,
    borderRadius: imageBorderRadius,
  };

  return (
    <View style={[wrapperStyles, style]}>
      <Image style={imageStyles} source={player.avatar ? { uri: `http://192.168.0.18:3000${player.avatar}` } : defaultAvatar} />
      { showNick && <Text style={styles.nick}>{player.nick}</Text> }
    </View>
  );
};

PlayerAvatar.defaultProps = {
  style: null,
  size: 'normal',
  showNick: true,
};

export default PlayerAvatar;
