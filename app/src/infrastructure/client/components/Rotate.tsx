import styled from 'styled-components';

import { transition } from '../styles/theme';

type RotateProps = {
  show: boolean;
};

export const Rotate = styled.div<RotateProps>`
  transform: rotate(${(props) => (props.show ? 0 : -360)}deg);
  transition: ${transition('transform')};
`;
