import styled from 'styled-components';

import { Theme, transition } from '../styles/theme';

type FadeProps = {
  show: boolean;
  speed?: keyof Theme['transition']['durations'];
};

export const Fade = styled.div<FadeProps>`
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: ${(props) => transition('opacity', props.speed)};
`;
