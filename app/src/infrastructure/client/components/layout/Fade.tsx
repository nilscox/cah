import styled from 'styled-components';

import { Theme, transition } from '../../styles/theme';

type FadeProps = {
  show: boolean;
  duration?: keyof Theme['transition']['durations'];
};

export const Fade = styled.div<FadeProps>`
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: ${(props) => transition('opacity', { duration: props.duration ?? 'default' })};
`;
