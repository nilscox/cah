import { Theme } from '@emotion/react';

const fast = false;

const themeSpacing = (...spacings: Array<number | string>) => {
  return spacings
    .map((value) => {
      if (typeof value === 'string') {
        return value;
      }

      return 6 * value + 'px';
    })
    .join(' ');
};

export const theme: Theme = {
  colors: {
    background: 'black',
    text: '#DDD',
    disabled: '#999',
    border: '#CCC',
  },
  font: "'JetBrains Mono', 'Courier New', Courier, monospace",
  fontSizes: {
    small: '12px',
    default: '14px',
    big: '1.4rem',
    title: '2rem',
  },
  spacing: themeSpacing,
  space: Array(8)
    .fill(0)
    .map((_, n) => themeSpacing(n)),
  fontWeights: {
    thin: 200,
    normal: 'normal',
    bold: 'bold',
  },
  durations: {
    default: 400,
    slow: 1000,
  },
  animationFunction: 'ease',
};

if (fast) {
  theme.durations.default /= 4;
  theme.durations.slow /= 4;
}

type Props = { theme: Theme };

export const color = (color: keyof Theme['colors']) => (props: Props) => {
  return props.theme.colors[color];
};

export const font = () => (props: Props) => {
  return props.theme.font;
};

export const fontSize = (fontSize: keyof Theme['fontSizes']) => (props: Props) => {
  return props.theme.fontSizes[fontSize];
};

export const fontWeight = (weight: keyof Theme['fontWeights']) => (props: Props) => {
  return props.theme.fontWeights[weight];
};

// prettier-ignore
export const spacing = (...args: Parameters<Theme['spacing']>) => (props: Props) => {
  return props.theme.spacing(...args);
};

type TransitionOptions = Partial<{
  duration: keyof Theme['durations'];
  delay: number;
}>;

export const transition = (property: string, options?: TransitionOptions) => (props: Props) => {
  const { duration = 'default', delay = 0 } = options ?? {};
  const { durations, animationFunction } = props.theme;

  return `${property} ${durations[duration]}ms ${animationFunction} ${delay}ms`;
};
