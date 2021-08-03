import React from 'react';

import styled from '@emotion/styled';

import { Choice } from '../../../../domain/entities/Choice';
import { spacing, transition } from '../../styles/theme';
import { conditionalCallback } from '../../views/utils/utils';
import Button from '../elements/Button';
import { RenderItemFunction, SortableList } from '../elements/SortableList';

import { ChoiceCard } from './ChoiceCard';

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  row-gap: 1px;
  align-content: flex-start;
`;

const ValidateContainer = styled.div<{ open: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ open }) => spacing(open ? 14 : 0)};
  overflow: hidden;
  transition: ${transition('height')};
`;

export type ChoiceCardsListProps = {
  choices: Choice[];
  selection: Choice[];
  onOrderChange?: (choices: Choice[]) => void;
  onSelectChoice?: (choice: Choice) => void;
  validateButtonVisible: boolean;
  onValidateSelection?: () => void;
};

export const ChoicesList: React.FC<ChoiceCardsListProps> = ({
  choices,
  selection,
  onSelectChoice,
  onOrderChange,
  validateButtonVisible,
  onValidateSelection,
}) => {
  const renderChoice: RenderItemFunction<Choice> = (choice, isSorting, dragHandle) => (
    <ChoiceCard
      choice={choice}
      selected={selection.includes(choice)}
      onClick={conditionalCallback(onSelectChoice, choice)}
      isSorting={isSorting}
      dragHandle={dragHandle}
    />
  );

  return (
    <>
      <Container>
        <SortableList items={choices} renderItem={renderChoice} onOrderChange={(choices) => onOrderChange?.(choices)} />
      </Container>
      <ValidateContainer open={validateButtonVisible}>
        <Button disabled={!onValidateSelection} onClick={onValidateSelection}>
          {onValidateSelection ? 'Valider' : 'Validé'}
        </Button>
      </ValidateContainer>
    </>
  );
};
