import React from 'react';

import styled from '@emotion/styled';

import { spacing, transition } from '../../styles/theme';

import { Center } from './Center';
import { Fade } from './Fade';

type BottomActionProps = {
  visible: boolean;
};

const Container = styled(Center)<BottomActionProps>`
  height: ${({ visible }) => spacing(visible ? 6 : 0)};
  transition: ${transition('height')};
  overflow: hidden;
`;

export const BottomAction: React.FC<BottomActionProps> = ({ visible, children }) => (
  <Container visible={visible}>
    <Fade show={visible} appear={visible}>
      {children}
    </Fade>
  </Container>
);
