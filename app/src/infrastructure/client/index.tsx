import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { createBrowserHistory } from 'history';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';

import { handleServerDown } from '../../domain/usecases/app/handleServerDown/handleServerDown';
import { configureStore } from '../../store/configureStore';
import { AppStore, Dependencies } from '../../store/types';
import { DeviceNetworkGateway } from '../gateways/DeviceNetworkGateway';
import { HTTPAdapter } from '../gateways/HTTPAdapter';
import { HTTPGameGateway } from '../gateways/HTTPGameGateway';
import { HTTPPlayerGateway } from '../gateways/HTTPPlayerGateway';
import { HTTPServerGateway } from '../gateways/HTTPServerGateway';
import { ReactRouterGateway } from '../gateways/ReactRouterGateway';
import { RealTimerGateway } from '../gateways/RealTimerGateway';
import { StoragePersistenceGateway } from '../gateways/StoragePersistenceGateway';
import { WSAdapter } from '../gateways/WSAdapter';
import { WSRTCGateway } from '../gateways/WSRTCGateway';

import App from './App';
import { ErrorBoundary } from './components/domain/ErrorBoundary';
import { GlobalStyles } from './styles/GlobalStyles';
import ThemeProvider from './styles/ThemeProvider';
import { gameHistory } from './views/GameView/GameView';

import 'jetbrains-mono';
import 'normalize.css';

declare global {
  interface Window {
    store?: AppStore;
    dependencies?: Dependencies;
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
});

const httpAdapter = new HTTPAdapter(axiosInstance);
const wsAdapter = new WSAdapter();

export type AxiosInstance = typeof axiosInstance;

export const history = createBrowserHistory();

const dependencies: Dependencies = {
  gameGateway: new HTTPGameGateway(httpAdapter),
  playerGateway: new HTTPPlayerGateway(httpAdapter),
  rtcGateway: new WSRTCGateway(wsAdapter),
  routerGateway: new ReactRouterGateway(history, gameHistory),
  timerGateway: new RealTimerGateway(),
  networkGateway: new DeviceNetworkGateway(),
  serverGateway: new HTTPServerGateway(httpAdapter),
  persistenceGateway: new StoragePersistenceGateway(localStorage),
};

const store = configureStore(dependencies);

httpAdapter.onServerDown = () => store.dispatch(handleServerDown());

window.store = store;
window.dependencies = dependencies;

ReactDOM.render(
  <ThemeProvider>
    <GlobalStyles />
    <ErrorBoundary>
      <Router history={history}>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </Router>
    </ErrorBoundary>
  </ThemeProvider>,
  document.getElementById('app'),
);
