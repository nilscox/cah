import React from 'react';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const scroll = keyframes`
  0% {
    left: 100%;
    opacity: 0;
  }

  5% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    left: -100%;
    opacity: 0;
  }
`;

const Container = styled.div`
  overflow: hidden;
`;

const Text = styled.div`
  white-space: nowrap;
  position: relative;
  animation-name: ${scroll};
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;

type NotificationProps = {
  text: string;
};

export const Notification: React.FC<NotificationProps> = ({ text }) => (
  <Container>
    <Text>{text}</Text>
  </Container>
);
