import React, { ReactElement } from 'react';

import styled from 'styled-components';

import { Player } from '../../../domain/entities/Player';
import { fontSize, fontWeight, spacing } from '../styles/theme';

import Flex from './Flex';

const Container = styled(Flex)`
  padding: ${spacing(2)};
`;

const Title = styled.div`
  margin: auto;
  font-weight: ${fontWeight('bold')};
`;

const PlayerNick = styled.div`
  font-size: ${fontSize('small')};
`;

type HeaderProps = {
  icon?: ReactElement;
  title?: string;
  player: Player;
};

const Header: React.FC<HeaderProps> = ({ icon, title, player }) => (
  <Container direction="row" alignItems="center">
    {icon}
    <Title>{title}</Title>
    <PlayerNick>{player.nick}</PlayerNick>
  </Container>
);

export default Header;
