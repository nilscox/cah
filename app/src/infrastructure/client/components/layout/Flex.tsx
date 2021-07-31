import styled from '@emotion/styled';

import { Box, BoxProps } from './Box';

export type FlexProps = BoxProps;

export const Flex = styled(Box)<FlexProps>`
  display: ${({ display }) => display ?? 'flex'};
  flex-direction: ${({ flexDirection }) => flexDirection ?? 'column'};
`;
