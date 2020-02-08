import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import useAxios from 'axios-hooks';
import { ToastContainer, toast, Slide } from 'react-toastify';
import io from 'socket.io-client';

import 'react-toastify/dist/ReactToastify.min.css';

import useGame from './hooks/use-game';
import usePlayer from './hooks/use-player';
import useHandleError from './hooks/useHandleError';

import Auth from './views/Auth';
import Lobby from './views/Lobby';
import Game from './views/Game';

import AnimatedViews from './components/AnimatedView';

import './styles.css';

const socket = io('http://localhost:4242');

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:4242';

const App: React.FC = () => {
  const [player, setPlayer] = usePlayer(socket);
  const [game, setGame] = useGame(socket);
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
      setPlayer(data.player);
      setGame(data.game);
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
      setGame(undefined);
      setLeaving(false);
    }, 1000);
  };

  const views = {
    auth: <Auth setPlayer={setPlayer} />,
    lobby: <Lobby setGame={setGame} />,
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

  return <AnimatedViews style={{ height: '100%', overflow: 'auto' }} views={views} current={view} />;
};

ReactDOM.render(
  <>
    <ToastContainer
      hideProgressBar
      autoClose={4000}
      closeButton={false}
      position={toast.POSITION.TOP_RIGHT}
      transition={Slide}
      draggablePercent={30}
      className="toast"
    />
    <App />
  </>,
  document.getElementById('app'),
);
