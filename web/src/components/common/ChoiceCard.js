import React from 'react';

const ChoiceCard = ({ choice, selected, onSelect }) => (
  <div className={'card choice' + (selected ? ' selected' : '')} onClick={onSelect}>
    <div className="text">{choice.text}</div>
  </div>
);

export default ChoiceCard
