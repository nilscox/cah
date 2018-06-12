// @flow

import * as React from 'react';
import { View, Image, Text } from 'react-native';

import type { Player } from '~/redux/state/player';
import type { Styles } from '~/types/styles';
import styles from './PlayerAvatar.styles.js'

type PlayerAvatarProps = {
  player: Player,
  style: ?Styles,
  size: 'big' | 'normal' | 'small',
  hideNick: boolean,
};

const defaultAvatar = require('./default-avatar.png');

const PlayerAvatar = ({ player, style, size, hideNick }: PlayerAvatarProps) => {
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
      <Image style={imageStyles} source={player.avatar || defaultAvatar} />
      { !hideNick && <Text style={styles.nick}>{player.nick}</Text> }
    </View>
  );
};

PlayerAvatar.defaultProps = {
  style: null,
  size: 'normal',
};

export default PlayerAvatar;
