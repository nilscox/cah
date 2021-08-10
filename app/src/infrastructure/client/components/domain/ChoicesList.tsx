import React from 'react';

import styled from '@emotion/styled';

import { Choice } from '../../../../domain/entities/Choice';
import { conditionalCallback } from '../../views/utils/utils';
import { RenderItemFunction, SortableList } from '../elements/SortableList';

import { ChoiceCard } from './ChoiceCard';

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  align-content: flex-start;
  background: white;
`;

export type ChoiceCardsListProps = {
  choices: Choice[];
  selection: Choice[];
  onOrderChange?: (choices: Choice[]) => void;
  onChoiceClick?: (choice: Choice) => void;
};

export const ChoicesList: React.FC<ChoiceCardsListProps> = ({ choices, selection, onChoiceClick, onOrderChange }) => {
  const renderChoice: RenderItemFunction<Choice> = (choice, isSorting, isBeingSorted, dragHandle) => (
    <ChoiceCard
      choice={choice}
      selected={selection.includes(choice)}
      onClick={conditionalCallback(onChoiceClick, choice)}
      isSorting={isSorting}
      isBeingSorted={isBeingSorted}
      dragHandle={dragHandle}
    />
  );

  return (
    <Container>
      <SortableList items={choices} renderItem={renderChoice} onOrderChange={(choices) => onOrderChange?.(choices)} />
    </Container>
  );
};
