import styled from 'styled-components';

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
  -webkit-tap-highlight-color: transparent;
`;

export default Button;
