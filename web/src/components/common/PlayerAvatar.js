// @flow

import * as React from 'react';
import Tooltip from 'material-ui/Tooltip';

import type { PlayerType } from '../../types/models';
import { toClassName } from '../../utils';

type PlayerAvatarProps = {|
  className?: string,
  player: PlayerType,
  tooltip: string,
|};

const PlayerAvatar = ({
  className,
  player,
  tooltip,
}: PlayerAvatarProps) => (
  <Tooltip title={tooltip} placement="bottom">

    <div className={toClassName([
      'player-avatar',
      'player-' + player.nick,
      className,
    ])}>

      <img className="avatar-image" alt={'avatar-' + player.nick} src={player.avatar} />

    </div>

  </Tooltip>
);

export default PlayerAvatar;
