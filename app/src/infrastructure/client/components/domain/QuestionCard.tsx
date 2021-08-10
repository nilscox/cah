import React from 'react';

import styled from '@emotion/styled';

import { Choice } from '../../../../domain/entities/Choice';
import { Question } from '../../../../domain/entities/Question';
import { color } from '../../styles/theme';
import TypedLabel from '../elements/TypedLabel';

const Blank = styled.span`
  width: 30px;
  display: inline-block;
  border-bottom: 1px solid ${color('text')};
`;

const ChoiceText = styled(TypedLabel)`
  color: white;
  text-decoration: underline;
  text-decoration-color: #999;
`;

const getChoiceText = (choice: Choice | null, animate: boolean) => {
  if (!choice) {
    return <Blank />;
  }

  return (
    <ChoiceText key={choice.text} animate={animate}>
      {choice.text.toLowerCase()}
    </ChoiceText>
  );
};

const getChunks = (question: Question, choices: (Choice | null)[], animate: boolean) => {
  if (!question.blanks) {
    return [<>{question.text}</>, <> </>, getChoiceText(choices[0], animate)];
  }

  const chunks = [];
  let lastPos = 0;

  question.blanks.map((pos, n) => {
    chunks.push(<>{question.text.slice(lastPos, pos)}</>);
    chunks.push(getChoiceText(choices[n], animate));
    lastPos = pos;
  });

  chunks.push(<>{question.text.slice(lastPos)}</>);

  return chunks;
};

const StyledQuestionCard = styled.div`
  line-height: 1.4rem;
`;

export type QuestionCardProps = {
  animate?: boolean;
  question: Question;
  choices: Array<Choice | null>;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ animate = false, question, choices }) => (
  <StyledQuestionCard>
    <div>
      {getChunks(question, choices, animate).map((chunk, n) => (
        <React.Fragment key={n}>{chunk}</React.Fragment>
      ))}
    </div>
  </StyledQuestionCard>
);
