// @flow

import React from 'react';
import QuestionCard from './QuestionCard';

import type { QuestionType, AnswerType } from '../../types';

type AnsweredQuestionCardProps = {
  className?: string,
  question: QuestionType,
  answer: AnswerType,
  onClick: (SyntheticEvent<>) => void,
};

const AnsweredQuestionCard = ({
  className,
  question,
  answer,
  onClick,
}: AnsweredQuestionCardProps) => (
  <QuestionCard
    className={className}
    question={question}
    choices={answer.answers}
    onClick={onClick}
  />
);

export default AnsweredQuestionCard;
