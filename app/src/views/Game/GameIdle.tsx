import React, { useState } from 'react';

import useAxios from 'axios-hooks';
import { animated, useSpring } from 'react-spring';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';

import InputForm from '../../components/InputForm';
import useHandleError from '../../hooks/useHandleError';

import PlayersList from './components/PlayersList';

type GameIdleProps = {
  player: PlayerDTO;
  game: GameDTO;
};

const GameIdle: React.FC<GameIdleProps> = ({ player, game }) => {
  const [showInput, setShowInput] = useState(false);

  const [{ error, loading }, startGame] = useAxios(
    {
      url: '/api/game/start',
      method: 'POST',
    },
    { manual: true }
  );

  useHandleError(error, {
    message: e => {
      if (e.response?.data === 'too many questions')
        return 'Not enough available questions.';
    },
  });

  // @ts-ignore
  const inputSpring = useSpring({
    config: { tension: 300 },
    from: { flex: 0, opacity: 0 },
    to: [{ flex: showInput ? 1 : 0 }, { opacity: showInput ? 1 : 0 }],
  });

  return (
    <div style={{ height: '100%', padding: 30, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: 22 }}>Waiting for all players to join.</h2>
      <div style={{ margin: '15px 0 ' }}>
        Game code: <span style={{ fontWeight: 'bold' }}>{game.id}</span>
      </div>
      <div style={{ flex: 2, overflow: 'auto', border: '1px solid #789', padding: 10 }}>
        <PlayersList game={game} players={game.players} />
      </div>
      { game.creator === player.nick && (
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          {game.players.length >= 2 && <button style={{ flex: 1 }} onClick={() => setShowInput(true)}>Start</button>}
          <animated.div style={{ overflow: 'hidden', width: '100%', ...inputSpring }}>
            <InputForm
              type="number"
              placeholder="Number of questions..."
              minLength={1}
              loading={loading}
              format={value => value.replace(/[^0-9]/g, '')}
              onSubmit={nbQuestion => startGame({ data: { nbQuestion: parseInt(nbQuestion, 10) } })}
            />
          </animated.div>
        </div>
      ) }
    </div>
  );
};

export default GameIdle;
