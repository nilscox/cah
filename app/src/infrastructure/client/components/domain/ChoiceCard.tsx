import React from 'react';

import styled from '@emotion/styled';

import { Choice } from '../../../../domain/entities/Choice';
import Sort from '../../icons/sort-handle.svg';
import { color, fontWeight, spacing, transition } from '../../styles/theme';
import Button from '../elements/Button';
import { Icon } from '../elements/Icon';
import { IconButton } from '../elements/IconButton';
import { DragHandle } from '../elements/SortableList';

const Container = styled.div<{ isSorting: boolean; isBeingSorted: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  visibility: ${({ isBeingSorted }) => (isBeingSorted ? 'hidden' : undefined)};
  border-bottom: 1px solid ${color('border')};
  border-top: ${({ isSorting, theme: { colors } }) => isSorting && `1px solid ${colors.border}`};
  background: ${({ isSorting }) => isSorting && 'white'};
`;

const Text = styled(Button)<{ selected?: boolean }>`
  flex: 1;
  padding: ${spacing(2)};
  border-left: ${({ selected }) => spacing(selected ? 2 : 0)} solid black;
  transition: ${transition('border-left')};
  font-weight: ${fontWeight('normal')};
  color: black;

  &:disabled {
    color: black;
  }
`;

const SortHandle = styled(IconButton)`
  color: #ccc;
  padding: ${spacing(1)};

  /* https://docs.dndkit.com/api-documentation/sensors/touch#touch-action */
  touch-action: none;
`;

export type ChoiceCardProps = {
  choice: Choice;
  selected: boolean;
  onClick?: () => void;
  isSorting: boolean;
  isBeingSorted: boolean;
  dragHandle: DragHandle;
};

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  choice,
  selected,
  onClick,
  isSorting,
  isBeingSorted,
  dragHandle,
}) => (
  <Container isSorting={isSorting} isBeingSorted={isBeingSorted}>
    <Text selected={selected} disabled={!onClick} onClick={onClick}>
      {choice.text}
    </Text>
    <SortHandle {...dragHandle}>
      <Icon as={Sort} size={3} />
    </SortHandle>
  </Container>
);
