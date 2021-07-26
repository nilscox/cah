import React from 'react';

import styled from 'styled-components';

import Check from '../../icons/check.svg';
import { Flex } from '../layout/Flex';

import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Input } from './Input';

type SubmitButtonProps = {
  show: boolean;
};

const SubmitButton = styled(IconButton)<SubmitButtonProps>`
  margin-left: 12px;
  cursor: ${(props) => !props.show && 'initial'};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 240ms ease-in-out;
`;

type SubmittableInputProps = React.ComponentProps<typeof Input> & {
  onSubmit: (event: React.FormEvent) => void;
};

const SubmittableInput: React.FC<SubmittableInputProps> = ({ onSubmit, ...props }) => {
  const { value } = props;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <Flex as="form" flexDirection="row" onSubmit={handleSubmit}>
      <Input {...props} />
      <SubmitButton type="submit" disabled={value === ''} show={value !== ''}>
        <Icon as={Check} />
      </SubmitButton>
    </Flex>
  );
};

export default SubmittableInput;
