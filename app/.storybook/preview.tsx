import React from 'react';

import { createGlobalStyle } from 'styled-components';

import { GlobalStyles } from '../src/infrastructure/client/styles/GlobalStyles';
import ThemeProvider from '../src/infrastructure/client/styles/ThemeProvider';

import 'jetbrains-mono';
import 'normalize.css';

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

export const decorators = [themeProviderDecorator];

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
