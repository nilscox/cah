const fast = true;

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

export const theme = {
  colors: {
    background: 'black',
    text: '#DDD',
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
  fontWeights: {
    thin: 200,
    bold: 'bold',
  },
  transition: {
    durations: {
      default: 400,
      slow: 1000,
    },
    function: 'ease',
  },
};

if (fast) {
  theme.transition.durations.default /= 4;
  theme.transition.durations.slow /= 4;
}

export type Theme = typeof theme;

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
  duration: keyof Theme['transition']['durations'] | number;
  delay: number;
}>;

const defaultTransitionOptions: TransitionOptions = {
  duration: 'default',
  delay: 0,
};

export const transition = (property: string, options?: TransitionOptions) => (props: Props) => {
  const { duration, delay } = { ...defaultTransitionOptions, ...options };
  const { transition } = props.theme;

  const getDuration = () => {
    if (typeof duration === 'string') {
      return transition.durations[duration];
    }

    return duration;
  };

  return `${property} ${getDuration()}ms ${transition.function} ${delay}ms`;
};
