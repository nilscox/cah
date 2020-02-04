import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import useAxios from 'axios-hooks';
import { ToastContainer } from 'react-toastify';
import io from 'socket.io-client';

import 'react-toastify/dist/ReactToastify.min.css';

import useGame from './hooks/use-game';
import usePlayer from './hooks/use-player';

import Auth from './views/Auth';
import Lobby from './views/Lobby';
import Game from './views/Game';

import './styles.css';
import AnimatedViews from './components/AnimatedView';

const socket = io('http://localhost:4242');

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:4242';

const App: React.FC = () => {
  const [player, setPlayer] = usePlayer(socket);
  const [game, setGame] = useGame(socket);
  const [view, setView] = useState('auth');

  const [{ loading, data, error, response }] = useAxios('/api/auth/me');

  useEffect(() => {
    if (response?.status === 200) {
      setPlayer(data.player);
      setGame(data.game);
    }
  }, [response?.status]);

  const views = {
    auth: <Auth setPlayer={setPlayer} />,
    lobby: <Lobby setGame={setGame} />,
    game: <Game game={game!} player={player!} />,
  };

  useEffect(() => {
    if (!player) {
      setView('auth');
    } else if (!game) {
      setView('lobby');
    } else {
      setView('game');
    }
  }, [player, game]);

  if (loading) {
    return null;
  }

  return (
    <AnimatedViews views={views} current={view}>
      <ToastContainer />
    </AnimatedViews>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
