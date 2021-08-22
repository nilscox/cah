import React from 'react';

import styled from '@emotion/styled';

import { color } from '../../styles/theme';

const StyledInput = styled.input<{ fullWidth?: boolean }>`
  background-color: transparent;
  color: ${color('text')};
  outline: none;
  border: none;
  border-bottom: 2px solid ${color('border')};
  width: ${({ fullWidth }) => fullWidth && '100%'};
`;

type InputProps = React.ComponentProps<typeof StyledInput> & {
  onTextChange: (text: string) => void;
};

export const Input: React.FC<InputProps> = ({ fullWidth = true, onTextChange, ...props }) => (
  <StyledInput
    fullWidth={fullWidth}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTextChange(e.target.value)}
    {...props}
  />
);
