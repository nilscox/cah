import React from 'react';

const ChoiceCard = ({ choice, className, onClick }) => (
  <div
    className={[
      'card',
      'choice',
      className,
    ].toClassName()}
    onClick={onClick}>
    <div className="text">{choice.text}</div>
  </div>
);

export default ChoiceCard;
