import React from 'react';

import useAxios from 'axios-hooks';

import { GameDTO } from 'dtos/game.dto';

import PlayersList from './components/PlayersList';

type GameIdleProps = {
  game: GameDTO;
};

const GameIdle: React.FC<GameIdleProps> = ({ game }) => {
  const [, startGame] = useAxios(
    {
      url: '/api/game/start',
      method: 'POST',
    },
    { manual: true }
  );

  return (
    <div style={{ height: '100%', padding: 30, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: 22 }}>Waiting for all players to join.</h2>
      <div style={{ margin: '15px 0 ' }}>
        Game code: <span style={{ fontWeight: 'bold' }}>{game.id}</span>
      </div>
      <div style={{ flex: 2, overflow: 'auto', border: '1px solid #789', padding: 10 }}>
        <PlayersList game={game} players={game.players} />
      </div>
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        {game.players.length >= 2 && <button onClick={() => startGame()}>Start</button>}
      </div>
    </div>
  );
};

export default GameIdle;
