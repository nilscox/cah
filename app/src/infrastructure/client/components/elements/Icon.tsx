import styled from '@emotion/styled';

import { spacing } from '../../styles/theme';

export const Icon = styled.svg<{ size?: number }>`
  width: ${({ size = 4 }) => spacing(size)};
  height: ${({ size = 4 }) => spacing(size)};
`;
