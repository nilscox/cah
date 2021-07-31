import { createGlobalStyle } from 'styled-components';

import { color, font, fontSize } from './theme';

export const GlobalStyles = createGlobalStyle`
  html {
    font-size: ${fontSize('default')};
    line-height: 1.5;
  }

  body {
    color: ${color('text')};
    font-family: ${font()};
  }
`;
