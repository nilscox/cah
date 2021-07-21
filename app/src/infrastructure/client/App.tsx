import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { connect } from '../../domain/player/connect/connect';
import { fetchMe } from '../../domain/player/fetchMe/fetchMe';
import { AppState } from '../../store/types';

import GameView from './views/GameView/GameView';
import LobbyView from './views/LobbyView/LobbyView';
import LoginView from './views/LoginView/LoginView';

const playerSelector = (state: AppState) => state.player;
const appReadySelector = (state: AppState) => state.app.ready;

const useFetchMe = () => {
  const dispatch = useDispatch();

  useEffect(() => void dispatch(fetchMe()), [dispatch]);

  return useSelector(appReadySelector);
};

const useConnect = () => {
  const player = useSelector(playerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (player && !player.isConnected) {
      dispatch(connect());
    }
  }, [player, dispatch]);
};

const App: React.FC = () => {
  const ready = useFetchMe();

  useConnect();

  if (!ready) {
    return null;
  }

  return (
    <Switch>
      <Route path="/login" component={LoginView} />
      <Route path="/" exact component={LobbyView} />
      <Route path="/game/:gameCode" component={GameView} />
      <Route>Not found.</Route>
    </Switch>
  );
};

export default App;
