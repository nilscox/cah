import { Theme } from '@emotion/react';

const fast = false;
const compact = false;

const makeSpacing =
  (unit: number) =>
  (...spacings: Array<number | string>) => {
    return spacings
      .map((value) => {
        if (typeof value === 'string') {
          return value;
        }

        return unit * value + 'px';
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
  spacing: makeSpacing(8),
  space: Array(8)
    .fill(0)
    .map((_, n) => makeSpacing(8)(n)),
  fontWeights: {
    thin: 200,
    normal: 'normal',
    bold: 'bold',
  },
  durations: {
    default: 300,
    slow: 1000,
  },
  animationFunction: 'ease',
};

if (fast) {
  theme.durations.default /= 4;
  theme.durations.slow /= 4;
}

if (compact) {
  theme.fontSizes = {
    ...theme.fontSizes,
    small: '10px',
    default: '14px',
  };

  theme.spacing = makeSpacing(5);
  theme.space = Array(8)
    .fill(0)
    .map((_, n) => makeSpacing(5)(n));
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
