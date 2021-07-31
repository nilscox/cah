import styled from '@emotion/styled';

import { Flex, FlexProps } from './Flex';

type CenterProps = FlexProps & {
  horizontal?: boolean;
  vertical?: boolean;
};

export const Center = styled(Flex)<CenterProps>`
  justify-content: ${({ vertical = true }) => (vertical ? 'center' : undefined)};
  align-items: ${({ horizontal = true }) => (horizontal ? 'center' : undefined)};
`;
