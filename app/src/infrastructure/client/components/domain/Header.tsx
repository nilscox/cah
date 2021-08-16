import React, { ReactElement } from 'react';

import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

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

export type HeaderProps = {
  left?: ReactElement;
  right?: ReactElement;
  title: string;
  notification?: string;
};

export const HeaderRightText = styled.div`
  padding-left: ${spacing(2)};
  font-size: ${fontSize('small')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Header: React.FC<HeaderProps> = ({ left, title, right, notification }) => {
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
        {left}
      </Box>

      <Switch value={notificationVisible ? 'notif' : 'title'} options={content} />

      <Box flex={notificationVisible ? undefined : 1} textAlign="right">
        {right}
      </Box>
    </Flex>
  );
};
export default Header;
