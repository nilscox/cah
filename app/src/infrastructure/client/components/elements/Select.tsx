import styled from '@emotion/styled';

import { color } from '../../styles/theme';

export const Select = styled.select`
  background: transparent;
  color: ${color('text')};
  border: ${color('border')};
  outline: none;

  & option {
    color: ${color('background')};
  }
`;
