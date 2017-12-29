import React from 'react';

const QuestionCard = ({ question, choices, onClick }) => {
  let choiceIdx = 0;

  const text = question.split.map((text, idx) => {
    const className = [];

    if (!text) {
      if (choices[choiceIdx]) {
        className.push('filled');
        text = choices[choiceIdx++].text;
      }
      else
        className.push('blank');
    }

    return <span key={idx} className={className}>{text}</span>;
  });

  return (
    <div className="card question" onClick={onClick}>
      <div className="text">{text}</div>
    </div>
  );
};

export default QuestionCard