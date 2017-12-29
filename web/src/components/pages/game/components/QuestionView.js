import React from 'react';
import QuestionCard from '../../../common/QuestionCard';

const QuestionView = ({ questionMaster, question, choices, disabled, onSubmit }) => {
  const canSubmit = !disabled && question.nb_choices === choices.length;
  const submit = () => {
    if (canSubmit)
      onSubmit();
  };

  return (
    <div className="question-view">
      <div className={'question-card' + (canSubmit ? ' can-submit' : '')}>
        <QuestionCard question={question} choices={choices} onClick={submit} />
        <div className="question-master">{questionMaster}</div>
      </div>
    </div>
  );
};

export default QuestionView;
