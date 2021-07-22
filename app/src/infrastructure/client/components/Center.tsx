import styled from 'styled-components';

import Flex from './Flex';

export const Center = styled(Flex)<{ padding?: number }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme, padding }) => theme.spacing(padding ?? 0)};
`;
