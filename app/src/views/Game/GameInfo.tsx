import React from 'react';

import { GameDTO } from 'dtos/game.dto';

import PlayersList from './components/PlayersList';

type GameInfoProps = {
  game: GameDTO;
};

const GameInfo: React.FC<GameInfoProps> = ({ game }) => (
  <>
    <div style={{ textAlign: 'right', fontSize: 12 }}>
      <div style={{ color: 'inherit' }}>Online</div>
      <div style={{ color: '#567' }}>Offline</div>
      <div style={{ color: '#7C9' }}>Answered</div>
    </div>

    <PlayersList game={game} players={game.players} />
  </>
);

export default GameInfo;
