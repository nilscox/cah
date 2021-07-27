import React from 'react';

import { Route } from 'react-router-dom';
import styled from 'styled-components';

import { Answer as AnswerType } from '../../../../../domain/entities/Answer';
import { QuestionCard } from '../../../components/domain/QuestionCard';
import { Center } from '../../../components/layout/Center';
import { useGame } from '../../../hooks/useGame';
import { fontSize, spacing } from '../../../styles/theme';

const Answer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing(4)};
  cursor: pointer;
`;

const PlayerNick = styled.div`
  font-size: ${fontSize('small')};
`;

type AnswersListProps = {
  onAnswerClick?: (answer: AnswerType) => void;
};

export const AnswersList: React.FC<AnswersListProps> = ({ onAnswerClick }) => {
  const game = useGame();

  return (
    <Center flex={1} padding={2} horizontal={false}>
      {game.answers.map((answer) => (
        <Answer key={answer.id} role="button" onClick={() => onAnswerClick?.(answer)}>
          <PlayerNick>
            <Route path="/game/:code/started/end-of-turn">{answer.player?.nick}</Route>
            <>&nbsp;</>
          </PlayerNick>
          <QuestionCard question={game.question} choices={answer.choices} />
        </Answer>
      ))}
    </Center>
  );
};
