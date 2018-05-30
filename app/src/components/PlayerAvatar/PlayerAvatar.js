// @flow

import * as React from 'react';
import { View } from 'react-native';

import type { Player } from '~/redux/state/player';

type PlayerAvatarProps = {
  player: Player,
};

// TODO
const PlayerAvatar = ({ player }: PlayerAvatarProps) => (
  <View />
);

export default PlayerAvatar;
