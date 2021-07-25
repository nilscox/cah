import React from 'react';

import styled from 'styled-components';

import { Choice } from '../../../../domain/entities/Choice';

import { ChoiceCard } from './ChoiceCard';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1;
  row-gap: 1px;
`;

export type ChoiceCardsListProps = {
  choices: Choice[];
  selection: Choice[];
  onChoiceClick: (choice: Choice) => void;
};

export const ChoicesList: React.FC<ChoiceCardsListProps> = ({ choices, selection, onChoiceClick }) => (
  <Container>
    {choices.map((choice) => (
      <ChoiceCard
        key={choice.id}
        choice={choice}
        selected={selection.includes(choice)}
        onClick={() => onChoiceClick(choice)}
      />
    ))}
  </Container>
);
