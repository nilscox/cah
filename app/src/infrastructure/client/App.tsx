import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { initialize } from '../../domain/usecases/player/initialize/initialize';
import { NetworkStatus } from '../../store/reducers/appStateReducer';
import { AppState } from '../../store/types';

import { Center } from './components/layout/Center';
import { Debounced } from './components/layout/Debounced';
import { FullScreen } from './components/layout/FullScreen';
import GameView from './views/GameView/GameView';
import LobbyView from './views/LobbyView/LobbyView';
import LoginView from './views/LoginView/LoginView';

const NoNetworkFallback: React.FC = () => (
  <FullScreen>
    <Center flex={1} padding={4}>
      Il semblerait que vous ne soyez pas connecté(e) à internet.
    </Center>
  </FullScreen>
);

const ServerDownFallback: React.FC = () => (
  <FullScreen>
    <Center flex={1} padding={4}>
      Le serveur est down. Merci de patienter, ça devrait revenir...
    </Center>
  </FullScreen>
);

const appReadySelector = (state: AppState) => state.app.ready;
const networkStatusSelector = (state: AppState) => state.app.network;
const serverStatusSelector = (state: AppState) => state.app.server;

const App: React.FC = () => {
  const dispatch = useDispatch();

  const network = useSelector(networkStatusSelector);
  const server = useSelector(serverStatusSelector);
  const ready = useSelector(appReadySelector);

  useEffect(() => void dispatch(initialize()), [dispatch]);

  if (network === NetworkStatus.down) {
    return <NoNetworkFallback />;
  }

  if (server === NetworkStatus.down) {
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
