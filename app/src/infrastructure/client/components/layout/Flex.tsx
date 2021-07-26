import styled from 'styled-components';

import { Box, BoxProps } from './Box';

export type FlexProps = BoxProps;

export const Flex = styled(Box)<FlexProps>``;

Flex.defaultProps = {
  display: 'flex',
  flexDirection: 'column',
};
