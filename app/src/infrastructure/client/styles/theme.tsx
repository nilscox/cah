export const theme = {
  colors: {
    background: 'black',
    text: '#DDD',
    border: '#CCC',
  },
  font: "'JetBrains Mono', 'Courier New', Courier, monospace",
  fontSizes: {
    small: '12px',
    default: '16px',
    title: '2rem',
    big: '1.4rem',
  },
  spacing: (...spacings: number[]) => spacings.map((value) => 6 * value + 'px').join(' '),
  fontWeights: {
    thin: 200,
    bold: 'bold',
  },
  transition: {
    durations: {
      default: 400,
      slow: 2000,
    },
    function: 'ease',
  },
};

export type Theme = typeof theme;

export const color = (color: keyof Theme['colors']) => (props: { theme: Theme }) => {
  return props.theme.colors[color];
};

export const font = () => (props: { theme: Theme }) => {
  return props.theme.font;
};

export const fontSize = (fontSize: keyof Theme['fontSizes']) => (props: { theme: Theme }) => {
  return props.theme.fontSizes[fontSize];
};

export const fontWeight = (weight: keyof Theme['fontWeights']) => (props: { theme: Theme }) => {
  return props.theme.fontWeights[weight];
};

// prettier-ignore
export const spacing = (...args: Parameters<Theme['spacing']>) => (props: { theme: Theme }) => {
  return props.theme.spacing(...args);
};

// prettier-ignore
export const transition = (property: string, duration: keyof Theme['transition']['durations'] = 'default') => (props: { theme: Theme }) => {
  return `${property} ${props.theme.transition.durations[duration]}ms ${theme.transition.function}`
};
