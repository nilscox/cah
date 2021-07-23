import React from 'react';

import { Provider as ReduxProvider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';

import { setPlayer } from '../src/domain/actions';
import ThemeProvider from '../src/infrastructure/client/styles/ThemeProvider';
import { GlobalStyles } from '../src/infrastructure/client/styles/GlobalStyles';
import { configureStore } from '../src/store/configureStore';
import { createPlayer } from '../src/tests/factories';

import { StubGameGateway, StubPlayerGateway, StubRTCGateway } from './stubs';

import 'normalize.css';
import 'jetbrains-mono';

export const StorybookGlobalStyles = createGlobalStyle`
  #root {
    height: 100vh;
  }
`;

const themeProviderDecorator = (Story) => (
  <ThemeProvider>
    <GlobalStyles />
    <StorybookGlobalStyles />
    <Story />
  </ThemeProvider>
);

const dependencies = {
  gameGateway: new StubGameGateway(),
  playerGateway: new StubPlayerGateway(),
  rtcGateway: new StubRTCGateway(),
};

const store = configureStore(dependencies);

store.dispatch(setPlayer(createPlayer()));

const reduxProviderDecorator = (Story) => (
  <ReduxProvider store={store}>
    <Story />
  </ReduxProvider>
);

export const decorators = [themeProviderDecorator, reduxProviderDecorator];

export const parameters = {
  backgrounds: {
    default: 'black',
    values: [{ name: 'black', value: 'black' }],
  },
  layout: 'fullscreen',
  viewport: {
    defaultViewport: 'mobile1',
  },
};
