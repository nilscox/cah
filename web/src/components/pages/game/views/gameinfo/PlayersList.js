// @flow

import * as React from 'react';

import type { PlayerType } from '../../../../../types/models';
import { toClassName } from '../../../../../utils';
import PlayerAvatar from '../../../../common/PlayerAvatar';

type PlayersListProps = {|
  players: Array<PlayerType>,
  isOnline: PlayerType => boolean,
  isQuestionMaster: PlayerType => boolean,
  hasSubmitted: PlayerType => boolean,
|};

const PlayersList = ({
  players,
  isOnline,
  isQuestionMaster,
  hasSubmitted,
}: PlayersListProps) => (
  <div className="players-list">
    {players.map(player => (
      <PlayerAvatar
        key={'player-' + player.nick}

        className={toClassName([
          'player',
          hasSubmitted(player) && 'has-submitted',
          isQuestionMaster(player) && 'is-question-master',
        ])}

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
