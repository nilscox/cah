import React from 'react';

import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import { theme } from './theme';

const ThemeProvider: React.FC = ({ children }) => (
  <>
    <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
  </>
);

export default ThemeProvider;
