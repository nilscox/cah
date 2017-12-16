import React from 'react';

const ChoiceCard = (props) => (
  <div className={'card choice' + (props.selected ? ' selected' : null)}>
    <div className="text">{props.choice.text}</div>
  </div>
);

export default ChoiceCard
