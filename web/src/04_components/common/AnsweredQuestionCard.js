// @flow

import * as React from 'react';
import QuestionCard from './QuestionCard';

import type { QuestionType, ChoiceType } from 'Types/models';

type AnsweredQuestionCardProps = {|
  className?: string,
  question: QuestionType,
  answer: Array<ChoiceType>,
  onClick?: SyntheticEvent<> => void,
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
    choices={answer}
    onClick={onClick}
  />
);

export default AnsweredQuestionCard;
