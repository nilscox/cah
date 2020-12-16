import React, { useState, useEffect } from 'react';

import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';
import { useSpring, animated, useTrail } from 'react-spring';

import { useDispatch } from '../hooks/useGame';
import useHandleError from '../hooks/useHandleError';
import InputForm from '../components/InputForm';

const JoinGame: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showInput, setShowInput] = useState(false);

  const [{ loading, data: game, error, response }, joinGame] = useAxios(
    {
      method: 'POST',
      url: '/api/game/join',
    },
    { manual: true },
  );

  useHandleError(error, {
    message: error => {
      if (error.response?.data === 'game not found') {
        return t('lobby.gameDoesNotExist') as string;
      }

      if (error.response?.data === 'game is not idle') {
        return t('lobby.gameAlreadyStarted') as string;
      }
    },
  });

  useEffect(() => {
    if (response?.status === 200) {
      dispatch({ type: 'setgame', game });
    }
  }, [response?.status]);

  // @ts-ignore
  const inputSpring = useSpring({
    config: { tension: 300 },
    from: { flex: 0, opacity: 0 },
    to: [{ flex: showInput ? 1 : 0 }, { opacity: showInput ? 1 : 0 }],
  });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={() => setShowInput(true)}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 20 }}>
        {t('lobby.joinGame')}
      </div>
      <animated.div style={{ overflow: 'hidden', ...inputSpring }}>
        <InputForm
          placeholder={t('lobby.gameCodePlaceholder')}
          minLength={4}
          maxLength={4}
          loading={loading}
          format={value => value.toUpperCase().replace(/[^A-Z0-9]/g, '')}
          onSubmit={gameId => joinGame({ data: { gameId } })}
        />
      </animated.div>
    </div>
  );
};

const CreateGame: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const [{ data: game, error, response }, createGame] = useAxios(
    {
      method: 'POST',
      url: '/api/game/new',
      data: { language: i18n.language },
    },
    { manual: true },
  );

  useHandleError(error);

  useEffect(() => {
    if (response?.status === 201) {
      dispatch({ type: 'setgame', game });
    }
  }, [response?.status]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 20,
      }}
      onClick={() => createGame()}
    >
      {t('lobby.createGame')}
    </div>
  );
};

const Lobby: React.FC = () => {
  const { t } = useTranslation();

  const trail = useTrail(3, {
    config: { tension: 70 },
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 500,
  });

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <animated.div style={{ flex: 1, display: 'flex', ...trail[0] }}>
        <JoinGame />
      </animated.div>

      <animated.div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...trail[1] }}>
        <div style={{ flex: 1, borderBottom: '2px solid #789' }} />
        <div style={{ margin: '0 20px', fontSize: 24 }}>{t('lobby.or')}</div>
        <div style={{ flex: 1, borderBottom: '2px solid #789' }} />
      </animated.div>

      <animated.div style={{ flex: 1, display: 'flex', ...trail[2] }}>
        <CreateGame />
      </animated.div>
    </div>
  );
};

export default Lobby;
