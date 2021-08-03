import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Flex, FlexProps } from '../components/layout/Flex';

const Container = styled(Flex)`
  height: 100%;
`;

const Content = styled(Flex)`
  flex: 1;
  overflow: auto;
`;

// emotion / reflexbox conflict on the `color` prop
type ViewProps = Omit<FlexProps, 'color'> & {
  header?: ReactElement;
};

export const View: React.FC<ViewProps> = ({ header, children, ...props }) => (
  <Container>
    {header}
    <Content {...props}>{children}</Content>
  </Container>
);
