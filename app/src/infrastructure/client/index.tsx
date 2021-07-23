import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { createBrowserHistory } from 'history';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';

import { handleServerDown } from '../../domain/usecases/server/handleServerDown/handleServerDown';
import { configureStore } from '../../store/configureStore';
import { Dependencies } from '../../store/types';
import { HTTPAdapter } from '../gateways/HTTPAdapter';
import { HTTPGameGateway } from '../gateways/HTTPGameGateway';
import { HTTPPlayerGateway } from '../gateways/HTTPPlayerGateway';
import { HTTPServerGateway } from '../gateways/HTTPServerGateway';
import { ReactRouterGateway } from '../gateways/ReactRouterGateway';
import { RealTimerGateway } from '../gateways/RealTimerGateway';
import { WSAdapter } from '../gateways/WSAdapter';
import { WSRTCGateway } from '../gateways/WSRTCGateway';

import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlobalStyles } from './styles/GlobalStyles';
import ThemeProvider from './styles/ThemeProvider';
import { gameRouterHistory } from './views/GameView/GameView';

import 'jetbrains-mono';
import 'normalize.css';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4242',
  withCredentials: true,
});

const httpAdapter = new HTTPAdapter(axiosInstance);
const wsAdapter = new WSAdapter();

export type AxiosInstance = typeof axiosInstance;

const history = createBrowserHistory();

const dependencies: Dependencies = {
  gameGateway: new HTTPGameGateway(httpAdapter),
  playerGateway: new HTTPPlayerGateway(httpAdapter),
  rtcGateway: new WSRTCGateway(wsAdapter),
  routerGateway: new ReactRouterGateway(history),
  gameRouterGateway: new ReactRouterGateway(gameRouterHistory),
  serverGateway: new HTTPServerGateway(httpAdapter),
  timerGateway: new RealTimerGateway(),
};

const store = configureStore(dependencies);

httpAdapter.onServerDown = () => store.dispatch(handleServerDown());

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
