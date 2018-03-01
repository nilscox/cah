// @flow

import * as React from 'react';

import type { PlayerType } from '../../../../../types/models';
import { toClassName } from '../../../../../utils';
import PlayerAvatar from '../../../../common/PlayerAvatar';

type PlayersListProps = {|
  players: Array<PlayerType>,
  isMe: PlayerType => boolean,
  isOnline: PlayerType => boolean,
  isQuestionMaster: PlayerType => boolean,
  hasSubmitted: PlayerType => boolean,
|};

const PlayersList = ({
  players,
  isMe,
  isOnline,
  isQuestionMaster,
  hasSubmitted,
}: PlayersListProps) => (
  <div className="players-list">
    {players.map(player => (
      <div
        key={"player-" + player.nick}
        className={toClassName([
          'player',
          !isOnline(player) && 'is-offline',
          hasSubmitted(player) && 'has-submitted',
          isQuestionMaster(player) && 'is-question-master',
        ])}>

        <PlayerAvatar
          player={player}
          canChange={isMe(player)}
          tooltip={'score: ' + player.score}
        />

        <div className="player-nick">{player.nick}</div>

      </div>
    ))}
  </div>
);

export default PlayersList;
