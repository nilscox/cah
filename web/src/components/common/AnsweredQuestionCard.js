// @flow

import * as React from 'react';
import QuestionCard from './QuestionCard';

import type { QuestionType, AnsweredQuestionType } from '../../types/models';

type AnsweredQuestionCardProps = {|
  className?: string,
  answeredQuestion: AnsweredQuestionType,
  onClick: SyntheticEvent<> => void,
|};

const AnsweredQuestionCard = ({
  className,
  question,
  answeredQuestion,
  onClick,
}: AnsweredQuestionCardProps) => (
  <QuestionCard
    className={className}
    question={answeredQuestion.question}
    choices={answeredQuestion.answers}
    onClick={onClick}
  />
);

export default AnsweredQuestionCard;
