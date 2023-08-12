import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.tsx'],
  theme: {
    backgroundColor: {
      transparent: 'transparent',
      body: colors.black,
      muted: colors.neutral[900],
      white: colors.white,
    },
    textColor: {
      body: colors.gray[200],
      dim: colors.gray[400],
      dark: colors.gray[900],
    },
    borderColor: {
      DEFAULT: colors.neutral[800],
      strong: colors.gray[400],
    },

    // prettier-ignore
    spacing: {
      0: '0',
      1: '0.25rem', // 4px
      2: '0.5rem',  // 8px
      3: '0.75rem', // 12px
      4: '1rem',    // 16px
      5: '1.5rem',  // 24px
      6: '2rem',    // 32px
    },

    fontFamily: {
      body: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      sm: ['0.875rem', 1.5],
      body: ['1rem', 1.5],
      large: ['1.25rem', 1.5],
      xl: ['2rem', 1.5],
    },
  },
  plugins: [],
};
