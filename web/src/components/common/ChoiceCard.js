import React from 'react';

const ChoiceCard = ({ choice, selected, canSelect, onSelect }) => (
  <div
    className={[
      'card choice',
      (canSelect ? ' can-select' : ''),
      (selected ? ' selected' : '')
    ].join('')}
    onClick={() => canSelect ? onSelect() : null}>
    <div className="text">{choice.text}</div>
  </div>
);

export default ChoiceCard
