import { Theme } from '@emotion/react';
import styled from '@emotion/styled';

import { transition } from '../../styles/theme';

type FadeProps = {
  show: boolean;
  duration?: keyof Theme['animations']['durations'];
};

export const Fade = styled.div<FadeProps>`
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: ${(props) => transition('opacity', { duration: props.duration ?? 'default' })};
`;
