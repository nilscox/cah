import React from 'react';

import { css, Global, ThemeProvider } from '@emotion/react';

import { GlobalStyles } from '../src/infrastructure/client/styles/GlobalStyles';
import { theme } from '../src/infrastructure/client/styles/theme';

import 'jetbrains-mono';
import 'normalize.css';

export const StorybookGlobalStyles: React.FC = () => (
  <Global
    styles={css`
      #root {
        height: 100vh;
        background-color: black;
      }
    `}
  />
);

const themingDecorator = (Story) => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
);

const globalStylesDecorator = (Story) => (
  <>
    <GlobalStyles />
    <StorybookGlobalStyles />
    <Story />
  </>
);

export const decorators = [globalStylesDecorator, themingDecorator];

export const parameters = {
  layout: 'fullscreen',
  viewport: {
    defaultViewport: 'mobile1',
  },
};
