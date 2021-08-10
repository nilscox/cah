import { Theme } from '@emotion/react';

const fast = false;
const compact = false;

const makeSpace = (n: number): number[] => {
  const a = [0, 1, 2, 2.5].map((m) => m * n);

  for (let i = a.length; i < 12; ++i) {
    a.push(a[i - 1] + a[i - 3]);
  }

  return a;
};

export const theme: Theme = {
  colors: {
    background: 'black',
    text: '#DDD',
    disabled: '#999',
    border: '#CCC',
  },
  fonts: {
    default: "'JetBrains Mono', 'Courier New', Courier, monospace",
  },
  fontSizes: {
    small: '12px',
    default: '14px',
    big: '1.4rem',
    title: '2rem',
  },
  space: makeSpace(8),
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

  theme.space = makeSpace(6);
}

type Props = { theme: Theme };

export const color = (color: keyof Theme['colors']) => (props: Props) => {
  return props.theme.colors[color];
};

export const font = () => (props: Props) => {
  return props.theme.fonts.default;
};

export const fontSize = (fontSize: keyof Theme['fontSizes']) => (props: Props) => {
  return props.theme.fontSizes[fontSize];
};

export const fontWeight = (weight: keyof Theme['fontWeights']) => (props: Props) => {
  return props.theme.fontWeights[weight];
};

// prettier-ignore
export const spacing = (...args: number[]) => (props: Props) => {
  return args.map(index => props.theme.space[index] + 'px').join(' ');
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
