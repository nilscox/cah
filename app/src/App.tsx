import React, { useEffect, useState, Suspense } from 'react';

import useAxios from 'axios-hooks';
import { ToastContainer, toast, Slide } from 'react-toastify';
import io from 'socket.io-client';

import useGame, { DispatchProvider } from './hooks/useGame';
import useHandleError from './hooks/useHandleError';

import Auth from './views/Auth';
import Lobby from './views/Lobby';
import Game from './views/Game';

import AnimatedViews from './components/AnimatedView';

const socket = io(process.env.API_URL as string);

const App: React.FC = () => {
  const { game, player, dispatch } = useGame(socket);
  const [view, setView] = useState('auth');
  const [leaving, setLeaving] = useState(false);

  const [{ loading, data, error, response }, refetchMe] = useAxios('/api/auth/me');

  useHandleError(error, {
    message: (e) => {
      if (e.response?.status === 403)
        return false;
    },
  });

  useEffect(() => {
    if (response?.status === 200) {
      dispatch({ type: 'setplayer', player: data.player });
      dispatch({ type: 'setgame', game: data.game });
    }
  }, [response?.status]);

  useEffect(() => {
    if (player) {
      refetchMe();
    }
  }, [player?.nick]);

  const onLeave = () => {
    setLeaving(true);
    setTimeout(() => {
      dispatch({ type: 'setgame', game: undefined });
      setLeaving(false);
    }, 1000);
  };

  const views = {
    auth: <Auth />,
    lobby: <Lobby />,
    game: <Game game={game!} player={player!} onLeave={onLeave} />,
  };

  useEffect(() => {
    if (!player) {
      setView('auth');
    } else if (!game || leaving) {
      setView('lobby');
    } else {
      setView('game');
    }
  }, [player, game, leaving]);

  if (loading) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <DispatchProvider value={dispatch}>
        <ToastContainer
          hideProgressBar
          autoClose={4000}
          closeButton={false}
          position={toast.POSITION.TOP_RIGHT}
          transition={Slide}
          draggablePercent={30}
          className="toast"
        />
        <AnimatedViews style={{ height: '100%', overflow: 'auto' }} views={views} current={view} />
      </DispatchProvider>
    </Suspense>
  );
};

export default App;
