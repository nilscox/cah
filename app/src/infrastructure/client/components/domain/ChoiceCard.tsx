import React from 'react';

import styled from 'styled-components';

import { Choice } from '../../../../domain/entities/Choice';
import Sort from '../../icons/sort-handle.svg';
import { spacing, transition } from '../../styles/theme';
import { Icon } from '../elements/Icon';
import { IconButton } from '../elements/IconButton';
import { DragHandle } from '../elements/SortableList';

const Container = styled.div<{ isSorting: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: white;
  visibility: ${({ isSorting }) => (isSorting ? 'hidden' : undefined)};
`;

const Text = styled.div<{ selected?: boolean }>`
  flex: 1;
  color: black;
  padding: ${spacing(2)};
  border-left: ${({ selected }) => spacing(selected ? 2 : 0)} solid black;
  transition: ${transition('border-left')};
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
`;

const SortHandle = styled(IconButton)`
  color: #ccc;
  padding: ${spacing(1)};
`;

export type ChoiceCardProps = {
  choice: Choice;
  selected: boolean;
  onClick: () => void;
  isSorting: boolean;
  dragHandle: DragHandle;
};

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ choice, selected, onClick, isSorting, dragHandle }) => (
  <Container isSorting={isSorting}>
    <Text selected={selected} onClick={onClick}>
      {choice.text}
    </Text>
    <SortHandle {...dragHandle}>
      <Icon as={Sort} size={3} />
    </SortHandle>
  </Container>
);
