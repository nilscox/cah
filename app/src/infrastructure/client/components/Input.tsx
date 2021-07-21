import React from 'react';

import styled from 'styled-components';

import { color } from '../styles/theme';

const StyledInput = styled.input`
  background-color: transparent;
  color: ${color('text')};
  outline: none;
  border: none;
  border-bottom: 2px solid ${color('border')};
  width: 100%;
`;

type InputProps = React.ComponentProps<typeof StyledInput> & {
  onTextChange: (text: string) => void;
};

export const Input: React.FC<InputProps> = ({ onTextChange, ...props }) => (
  <StyledInput onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTextChange(e.target.value)} {...props} />
);
