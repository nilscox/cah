import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { initialize } from '../../domain/player/initialize/initialize';
import { ServerStatus } from '../../store/reducers/appStateReducer';
import { AppState } from '../../store/types';

import { Center } from './components/Center';
import { Debounced } from './components/Debounced';
import { FullScreen } from './components/FullScreen';
import GameView from './views/GameView/GameView';
import LobbyView from './views/LobbyView/LobbyView';
import LoginView from './views/LoginView/LoginView';

const ServerDownFallback: React.FC = () => (
  <FullScreen>
    <Center padding={4}>Le serveur est down. Merci de patienter, ça devrait revenir...</Center>
  </FullScreen>
);

const appReadySelector = (state: AppState) => state.app.ready;
const serverStatusSelector = (state: AppState) => state.app.server;

const App: React.FC = () => {
  const dispatch = useDispatch();

  const server = useSelector(serverStatusSelector);
  const ready = useSelector(appReadySelector);

  useEffect(() => void dispatch(initialize()), [dispatch]);

  if (server === ServerStatus.down) {
    return <ServerDownFallback />;
  }

  if (!ready) {
    return <Debounced delay={1000}>Chargement...</Debounced>;
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
