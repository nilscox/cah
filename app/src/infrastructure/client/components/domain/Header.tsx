import React, { ReactElement } from 'react';

import styled from '@emotion/styled';
import { Box } from 'reflexbox';

import { Player } from '../../../../domain/entities/Player';
import { fontSize, fontWeight, spacing } from '../../styles/theme';
import { Flex } from '../layout/Flex';

import { Notification } from './Notification';

const Title = styled.h1`
  margin: 0;
  font-size: ${fontSize('default')};
  font-weight: ${fontWeight('bold')};
`;

const PlayerNick = styled.div`
  padding-left: ${spacing(2)};
  font-size: ${fontSize('small')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export type HeaderProps = {
  icon?: ReactElement;
  title: string;
  player: Player;
  notification?: string;
};

const Header: React.FC<HeaderProps> = ({ icon, title, player, notification }) => (
  <Flex flexDirection="row" alignItems="center" padding={2}>
    <Box flex={notification ? undefined : 1} paddingRight={2}>
      {icon}
    </Box>

    {notification ? (
      <Box flex={1}>
        <Notification text={notification} />
      </Box>
    ) : (
      <Title>{title}</Title>
    )}

    <Box flex={notification ? undefined : 1} textAlign="right">
      <PlayerNick>{player.nick}</PlayerNick>
    </Box>
  </Flex>
);

export default Header;
