import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Player } from '../../../../domain/entities/Player';
import { spacing } from '../../styles/theme';
import { Flex } from '../layout/Flex';

import Header from './Header';

const Container = styled(Flex)`
  height: 100%;
`;

const Content = styled(Flex)`
  flex: 1;
  overflow: auto;
  padding: ${spacing(2)};
`;

type ViewProps = {
  icon?: ReactElement;
  player?: Player;
};

export const View: React.FC<ViewProps> = ({ icon, player, children }) => (
  <Container>
    {player && <Header icon={icon} title="CAH" player={player} />}
    <Content>{children}</Content>
  </Container>
);
