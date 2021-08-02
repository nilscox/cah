import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Flex } from '../components/layout/Flex';

const Container = styled(Flex)`
  height: 100%;
`;

const Content = styled(Flex)`
  flex: 1;
  overflow: auto;
`;

type ViewProps = {
  header?: ReactElement;
};

export const View: React.FC<ViewProps> = ({ header, children }) => (
  <Container>
    {header}
    <Content>{children}</Content>
  </Container>
);
