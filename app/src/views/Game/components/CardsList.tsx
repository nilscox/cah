import React from 'react';

import { ChoiceDTO } from 'dtos/choice.dto';

type CardsListProps = {
  cards: ChoiceDTO[];
  onSelect: (choice: ChoiceDTO) => void;
  isSelected: (choice: ChoiceDTO) => boolean;
  canSelect: (choice: ChoiceDTO) => boolean;
};

const CardsList: React.FC<CardsListProps> = ({ cards, onSelect, isSelected, canSelect }) => (
  <>
    { cards.map((choice: any) => (
      <div
        key={choice.text}
        onClick={() => canSelect(choice) && onSelect(choice)}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: 12,
          borderBottom: '1px solid #CCC',
          background: 'white',
          fontWeight: isSelected(choice) ? 'bold' : 'initial',
          cursor: canSelect(choice) ? 'pointer' : 'initial',
        }}
      >
        { choice.text }
      </div>
    )) }
  </>
);

export default CardsList;
