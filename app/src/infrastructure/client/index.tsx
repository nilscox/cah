import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { createBrowserHistory } from 'history';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';

import { configureStore } from '../../store';
import { Dependencies } from '../../store/types';
import { HTTPAdapter } from '../gateways/HTTPAdapter';
import { HTTPGameGateway } from '../gateways/HTTPGameGateway';
import { HTTPPlayerGateway } from '../gateways/HTTPPlayerGateway';
import { ReactRouterGateway } from '../gateways/ReactRouterGateway';
import { WSAdapter } from '../gateways/WSAdapter';
import { WSRTCGateway } from '../gateways/WSRTCGateway';

import App from './App';
import { GlobalStyles } from './styles/GlobalStyles';
import ThemeProvider from './styles/ThemeProvider';

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
};

const store = configureStore(dependencies);

ReactDOM.render(
  <ThemeProvider>
    <GlobalStyles />
    <Router history={history}>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </Router>
  </ThemeProvider>,
  document.getElementById('app'),
);
