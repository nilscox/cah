import React from 'react';

const QuestionCard = (props) => {
  const text = props.question.split.map((text, idx) => (
    <span key={idx} className={!text ? 'blank' : null}>{text}</span>
  ));

  return (
    <div className="card question">
      <div className="text">{text}</div>
    </div>
  );
};

export default QuestionCard
