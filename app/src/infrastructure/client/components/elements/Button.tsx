import { Theme } from '@emotion/react';
import styled from '@emotion/styled';

import { color, fontWeight } from '../../styles/theme';

type ButtonProps = {
  size?: keyof Theme['fontSizes'];
};

export const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  background-color: transparent;
  color: ${color('text')};
  font-weight: ${fontWeight('bold')};
  font-size: ${({ size = 'default', theme }) => theme.fontSizes[size]};
  border: none;
  padding: 0;
  outline: none;
  user-select: none;

  -webkit-tap-highlight-color: transparent;

  &:not(:disabled) {
    cursor: pointer;
  }

  &:disabled {
    color: ${color('disabled')};
  }
`;

export default Button;
