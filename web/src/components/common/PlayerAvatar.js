import React from 'react';
import Tooltip from 'material-ui/Tooltip';

const PlayerAvatar = ({ player, tooltip, className }) => (
  <Tooltip title={tooltip} placement="bottom">

    <div className={[
      'player-avatar',
      'player-' + player.nick,
      !player.connected && 'player-offline',
      className,
    ].toClassName()}>

      <img className="avatar-image" alt="player-avatar" src={player.avatar} />

    </div>

  </Tooltip>
);

export default PlayerAvatar;
