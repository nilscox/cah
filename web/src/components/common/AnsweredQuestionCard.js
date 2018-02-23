// @flow

import * as React from 'react';
import QuestionCard from './QuestionCard';

import type { QuestionType, AnsweredQuestionType } from '../../types/models';

type AnsweredQuestionCardProps = {|
  className?: string,
  question: QuestionType,
  answer: AnsweredQuestionType,
  onClick: (SyntheticEvent<>) => void,
|};

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
