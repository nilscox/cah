import React from 'react';

import styled from 'styled-components';

import { Choice } from '../../../../domain/entities/Choice';
import Sort from '../../icons/sort-handle.svg';
import { spacing, transition } from '../../styles/theme';
import { Icon } from '../elements/Icon';

const Container = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: white;
  color: black;
  padding: ${spacing(2)};
  margin-left: ${({ selected }) => spacing(selected ? 2 : 0)};
  transition: ${transition('margin-left')};
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
`;

const Text = styled.div`
  flex: 1;
`;

const SortHandle = styled(Icon)`
  color: #ccc;
`;

export type ChoiceCardProps = {
  choice: Choice;
  selected: boolean;
  onClick: () => void;
};

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ choice, selected, onClick }) => (
  <Container selected={selected} onClick={onClick}>
    <Text>{choice.text}</Text>
    <SortHandle as={Sort} size={3} />
  </Container>
);
