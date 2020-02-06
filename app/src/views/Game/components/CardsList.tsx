import React from 'react';

import { ChoiceDTO } from 'dtos/choice.dto';

type CardsListProps = {
  cards: ChoiceDTO[];
  onSelect: (choice: ChoiceDTO) => void;
  isSelected: (choice: ChoiceDTO) => boolean;
  canSelect: (choice: ChoiceDTO) => boolean;
};

const CardsList: React.FC<CardsListProps> = ({ cards, onSelect, isSelected, canSelect }) => (
  <ul>
    { cards.map((choice: any) => (
      <li
        key={choice.text}
        onClick={() => canSelect(choice) && onSelect(choice)}
        style={{
          padding: 12,
          borderBottom: '1px solid #CCC',
          background: 'white',
          fontWeight: isSelected(choice) ? 'bold' : 'initial',
          cursor: canSelect(choice) ? 'pointer' : 'initial',
        }}
      >
        { choice.text }
      </li>
    )) }
  </ul>
);

export default CardsList;
