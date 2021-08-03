import React, { ReactElement } from 'react';

import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

import { Player } from '../../../../domain/entities/Player';
import { useDebounce } from '../../hooks/useDebounce';
import { fontSize, fontWeight, spacing } from '../../styles/theme';
import { Box } from '../layout/Box';
import { Fade } from '../layout/Fade';
import { Flex } from '../layout/Flex';

import { Notification } from './Notification';
import { Switch } from './Switch';

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

const Header: React.FC<HeaderProps> = ({ icon, title, player, notification }) => {
  const theme = useTheme();
  const notificationVisible = useDebounce(!!notification, theme.durations.default);

  const content = {
    notif: (
      <Flex flex={1}>
        <Notification text={notification ?? ''} />
      </Flex>
    ),
    title: (
      <Fade appear show={!notification}>
        <Title>{title}</Title>
      </Fade>
    ),
  };

  return (
    <Flex flexDirection="row" alignItems="center" padding={2}>
      <Box flex={notificationVisible ? undefined : 1} paddingRight={2}>
        {icon}
      </Box>

      <Switch value={notificationVisible ? 'notif' : 'title'} options={content} />

      <Box flex={notificationVisible ? undefined : 1} textAlign="right">
        <PlayerNick>{player.nick}</PlayerNick>
      </Box>
    </Flex>
  );
};
export default Header;
