import styled from '@emotion/styled';
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
