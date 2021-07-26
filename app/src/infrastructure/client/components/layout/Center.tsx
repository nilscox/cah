import styled from 'styled-components';

import { Flex, FlexProps } from './Flex';

type CenterProps = FlexProps & {
  horizontal?: boolean;
  vertical?: boolean;
};

export const Center = styled(Flex)<CenterProps>`
  justify-content: ${({ vertical }) => (vertical ? 'center' : undefined)};
  align-items: ${({ horizontal }) => (horizontal ? 'center' : undefined)};
`;

Center.defaultProps = {
  flexDirection: 'column',
  horizontal: true,
  vertical: true,
};
