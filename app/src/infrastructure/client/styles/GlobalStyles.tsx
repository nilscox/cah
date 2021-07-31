import React from 'react';

import { css, Global, useTheme } from '@emotion/react';

export const GlobalStyles: React.FC = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        html {
          font-size: ${theme.fontSizes.default};
          line-height: 1.5;
        }

        body {
          color: ${theme.colors.text};
          font-family: ${theme.font};
        }
      `}
    />
  );
};
