import styled from '@emotion/styled';
// this is the only authorized import from reflexbox
// eslint-disable-next-line no-restricted-imports
import { Box as ReflexBox, BoxProps as ReflexBoxProps } from 'reflexbox';

import { spacing } from '../../styles/theme';

export type BoxProps = ReflexBoxProps & {
  minHeight?: number;
};

export const Box = styled(ReflexBox)<BoxProps>`
  && {
    min-height: ${({ minHeight }) => minHeight && spacing(minHeight)};
  }
`;
