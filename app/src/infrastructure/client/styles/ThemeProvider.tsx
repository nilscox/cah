import React from 'react';

import { ThemeProvider as SCThemeProvider } from 'styled-components';

import { theme } from './theme';

const ThemeProvider: React.FC = ({ children }) => (
  <>
    <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
  </>
);

export default ThemeProvider;
