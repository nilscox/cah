import React from 'react';

import styled from 'styled-components';

import { Choice } from '../../../../domain/entities/Choice';
import { RenderItemFunction, SortableList } from '../elements/SortableList';

import { ChoiceCard } from './ChoiceCard';

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1;
  row-gap: 1px;
`;

export type ChoiceCardsListProps = {
  choices: Choice[];
  selection: Choice[];
  onChoiceClick: (choice: Choice) => void;
  onOrderChange: (choices: Choice[]) => void;
};

export const ChoicesList: React.FC<ChoiceCardsListProps> = ({ choices, selection, onChoiceClick, onOrderChange }) => {
  const renderChoice: RenderItemFunction<Choice> = (choice, isSorting, dragHandle) => (
    <ChoiceCard
      choice={choice}
      selected={selection.includes(choice)}
      onClick={() => onChoiceClick(choice)}
      isSorting={isSorting}
      dragHandle={dragHandle}
    />
  );

  return (
    <Container>
      <SortableList items={choices} renderItem={renderChoice} onOrderChange={onOrderChange} />
    </Container>
  );
};
