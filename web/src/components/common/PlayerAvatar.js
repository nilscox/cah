// @flow

import React from 'react';
import Tooltip from 'material-ui/Tooltip';

import type { PlayerType } from '../../types/models';
import { toClassName } from '../../utils';

type PlayerAvatarProps = {|
  className?: string,
  player: PlayerType,
  tooltip: string,
|};

const PlayerAvatar = ({
  player,
  tooltip,
  className,
}: PlayerAvatarProps) => (
  <Tooltip title={tooltip} placement="bottom">

    <div className={toClassName([
      'player-avatar',
      'player-' + player.nick,
      !player.connected && 'player-offline',
      className,
    ])}>

      <img className="avatar-image" alt="player-avatar" src={player.avatar} />

    </div>

  </Tooltip>
);

export default PlayerAvatar;
