import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Player } from '../../../../domain/entities/Player';
import { fontSize, fontWeight } from '../../styles/theme';
import { Flex } from '../layout/Flex';

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
  <Flex flexDirection="row" alignItems="center" padding={2}>
    {icon}
    <Title>{title}</Title>
    <PlayerNick>{player.nick}</PlayerNick>
  </Flex>
);

export default Header;
