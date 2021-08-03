import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      background: string;
      text: string;
      disabled: string;
      border: string;
    };
    font: string;
    fontSizes: {
      small: string;
      default: string;
      big: string;
      title: string;
    };
    spacing: themeSpacing;
    space: string[];
    fontWeights: {
      thin: number;
      normal: string;
      bold: string;
    };
    durations: {
      default: number;
      slow: number;
    };
    animationFunction: string;
  }
}
