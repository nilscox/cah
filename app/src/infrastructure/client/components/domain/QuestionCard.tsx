import React from 'react';

import styled from '@emotion/styled';

import { Choice } from '../../../../domain/entities/Choice';
import { Question } from '../../../../domain/entities/Question';
import { color, fontWeight, spacing } from '../../styles/theme';

const Blank = styled.span`
  width: 30px;
  display: inline-block;
  border-bottom: 1px solid ${color('text')};
`;

const ChoiceText = styled.span`
  color: white;
  /* font-weight: ${fontWeight('bold')}; */
  text-decoration: underline;
  text-decoration-color: #999;
`;

const getChoiceText = (choice: Choice | null) => {
  if (!choice) {
    return <Blank />;
  }

  return <ChoiceText>{choice.text.toLowerCase()}</ChoiceText>;
};

const getChunks = (question: Question, choices: (Choice | null)[]) => {
  if (!question.blanks) {
    return [<>{question.text}</>, <> </>, getChoiceText(choices[0])];
  }

  const chunks = [];
  let lastPos = 0;

  question.blanks.map((pos, n) => {
    chunks.push(<>{question.text.slice(lastPos, pos)}</>);
    chunks.push(getChoiceText(choices[n]));
    lastPos = pos;
  });

  chunks.push(<>{question.text.slice(lastPos)}</>);

  return chunks;
};

const StyledQuestionCard = styled.div`
  padding: ${spacing(1, 2)};
  line-height: 1.4rem;
`;

export type QuestionCardProps = {
  question: Question;
  choices: Choice[];
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, choices }) => (
  <StyledQuestionCard>
    <div>
      {getChunks(question, choices).map((chunk, n) => (
        <React.Fragment key={n}>{chunk}</React.Fragment>
      ))}
    </div>
  </StyledQuestionCard>
);
