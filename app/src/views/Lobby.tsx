import React, { useState, useEffect } from 'react';

import useAxios from 'axios-hooks';
import { useSpring, animated, useTrail } from 'react-spring';

import { GameDTO } from 'dtos/game.dto';

import InputForm from '../components/InputForm';
import useHandleError from '../hooks/useHandleError';

type JoinGameProps = {
  setGame: (game: GameDTO) => void;
};

const JoinGame: React.FC<JoinGameProps> = ({ setGame }) => {
  const [showInput, setShowInput] = useState(false);

  const [{ loading, data: game, error, response }, joinGame] = useAxios(
    {
      method: 'POST',
      url: '/api/game/join',
    },
    { manual: true }
  );

  useHandleError(error, {
    message: error => {
      if (error.response?.data === 'game not found') {
        return 'This game code does not exist, please check';
      }

      if (error.response?.data === 'game is not idle') {
        return "This game has already started, you can't join it";
      }
    },
  });

  useEffect(() => {
    if (response?.status === 200) {
      setGame(game);
    }
  }, [response?.status]);

  // @ts-ignore
  const inputSpring = useSpring({
    config: { tension: 300 },
    from: { flex: 0, opacity: 0 },
    to: [{ flex: showInput ? 1 : 0 }, { opacity: showInput ? 1 : 0 }],
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <button style={{ flex: 1, fontWeight: 'bold', fontSize: 20 }} onClick={() => setShowInput(true)}>
        Join a game
      </button>
      <animated.div style={{ overflow: 'hidden', ...inputSpring }}>
        <InputForm
          placeholder="Game code..."
          minLength={4}
          maxLength={4}
          loading={loading}
          defaultValue="ABCD"
          onSubmit={gameId => joinGame({ data: { gameId } })}
        />
      </animated.div>
    </div>
  );
};

type CreateGameProps = {
  setGame: (game: GameDTO) => void;
};

const CreateGame: React.FC<CreateGameProps> = ({ setGame }) => {
  const [{ loading, data: game, error, response }, createGame] = useAxios(
    {
      method: 'POST',
      url: '/api/game/new',
    },
    { manual: true }
  );

  useHandleError(error);

  useEffect(() => {
    if (response?.status === 201) {
      setGame(game);
    }
  }, [response?.status]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <button style={{ fontWeight: 'bold', fontSize: 20 }} onClick={() => createGame()}>
        Create a new game
      </button>
    </div>
  );
};

type LobbyProps = {
  setGame: (game: GameDTO) => void;
};

const Lobby: React.FC<LobbyProps> = ({ setGame }) => {
  const trail = useTrail(3, {
    config: { tension: 70 },
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 500,
  });

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <animated.div style={{ flex: 1, display: 'flex', ...trail[0] }}>
        <JoinGame setGame={setGame} />
      </animated.div>

      <animated.div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...trail[1] }}>
        <div style={{ flex: 1, borderBottom: '2px solid #789' }} />
        <div style={{ margin: '0 20px', fontSize: 24 }}>OR</div>
        <div style={{ flex: 1, borderBottom: '2px solid #789' }} />
      </animated.div>

      <animated.div style={{ flex: 1, display: 'flex', ...trail[2] }}>
        <CreateGame setGame={setGame} />
      </animated.div>
    </div>
  );
};

export default Lobby;
