import React from 'react';

import PlayerAvatar from '../../../../common/PlayerAvatar';

const PlayersList = ({
  players,
  isOnline,
  isQuestionMaster,
  hasSubmitted,
}) => (
  <div className="players-list">
    {players.map(player => (
      <PlayerAvatar
        key={'player-' + player.nick}

        className={[
          'player',
          hasSubmitted(player) && 'has-submitted',
          isQuestionMaster(player) && 'is-question-master',
        ].toClassName()}

        player={{
          nick: player.nick,
          avatar: '/img/default_avatar.png',
          connected: isOnline(player),
        }}

        tooltip={'score: ' + player.score}
      />
    ))}
  </div>
);

export default PlayersList;
