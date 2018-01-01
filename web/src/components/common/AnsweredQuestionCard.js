import React from 'react';
import QuestionCard from './QuestionCard';

const AnsweredQuestionCard = ({ question, answer, onClick }) => {
  return <QuestionCard question={question} choices={answer.answers} onClick={onClick} />;
};

export default AnsweredQuestionCard;
