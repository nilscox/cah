import styled, { keyframes } from 'styled-components';

import { Theme } from '../../styles/theme';

const appear = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const duration =
  (duration: keyof Theme['animations']['durations'] = 'default', factor = 1) =>
  ({ theme }: { theme: Theme }) => {
    return theme.animations.durations[duration] * factor;
  };

type FadeInProps = {
  speed?: keyof Theme['animations']['durations'];
  factor?: number;
  delay?: number;
};

export const FadeIn = styled.div<FadeInProps>`
  animation-duration: ${({ speed, factor }) => duration(speed, factor)}ms;
  animation-delay: ${({ speed, delay }) => duration(speed, delay)}ms;
  animation-fill-mode: both;
  animation-iteration-count: 1;
  animation-name: ${appear};
`;
