import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { configureStore } from '../../store';
import { Dependencies } from '../../store/types';
import { HTTPAdapter } from '../gateways/HTTPAdapter';
import { HTTPGameGateway } from '../gateways/HTTPGameGateway';
import { HTTPPlayerGateway } from '../gateways/HTTPPlayerGateway';
import { WSAdapter } from '../gateways/WSAdapter';
import { WSRTCGateway } from '../gateways/WSRTCGateway';

import App from './App';
import { GlobalStyles } from './styles/GlobalStyles';
import ThemeProvider from './styles/ThemeProvider';

import 'normalize.css';
import 'jetbrains-mono';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4242',
  withCredentials: true,
});

const httpAdapter = new HTTPAdapter(axiosInstance);
const wsAdapter = new WSAdapter();

export type AxiosInstance = typeof axiosInstance;

const dependencies: Dependencies = {
  gameGateway: new HTTPGameGateway(httpAdapter),
  playerGateway: new HTTPPlayerGateway(httpAdapter),
  rtcGateway: new WSRTCGateway(wsAdapter),
};

const store = configureStore(dependencies);

ReactDOM.render(
  <BrowserRouter>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </ReduxProvider>
  </BrowserRouter>,
  document.getElementById('app'),
);
