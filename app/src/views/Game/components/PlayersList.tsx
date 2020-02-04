import React from 'react';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';

const color = (game: GameDTO, player: PlayerDTO) => {
  if (!player.connected)
    return '#567';

  if (game.answered?.includes(player.nick))
    return '#7C9';

  return 'inherit';
};

type PlayersListProps = {
  game: GameDTO;
  players: PlayerDTO[];
};

const PlayersList: React.FC<PlayersListProps> = ({ game, players }) => (
  <>
    { players.map(player => (
      <div key={player.nick} style={{ color: color(game, player) }}>
        { player.nick }
      </div>
    )) }
  </>
);

export default PlayersList;
