import styled from '@emotion/styled';

import { color, fontWeight } from '../../styles/theme';

type ButtonProps = {
  size?: 'big';
};

export const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  color: ${color('text')};
  font-weight: ${fontWeight('bold')};
  font-size: ${({ size, theme }) => size === 'big' && theme.fontSizes.big};
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  &:disabled {
    color: ${color('disabled')};
  }
`;

export default Button;
