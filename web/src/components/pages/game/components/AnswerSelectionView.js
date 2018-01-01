import React from 'react';
import AnsweredQuestionCard from '../../../common/AnsweredQuestionCard';

const AnswerSelectionView = ({ question, answers, canSelect, onSelect }) => (
  <div className="answer-selection-view">
    <div className={'answers-list' + (canSelect ? ' can-select' : '')}>
      { answers.map(answer => <AnsweredQuestionCard key={answer.id} question={question} answer={answer} onClick={() => canSelect ? onSelect(answer.id) : null} />) }
    </div>
  </div>
);

export default AnswerSelectionView;
