import React from 'react';

import { Route } from 'react-router-dom';
import styled from 'styled-components';

import { PlayState } from '../../../../../../../shared/enums';
import { AnonymousAnswer, Answer as AnswerType } from '../../../../../domain/entities/Answer';
import { selectWinner } from '../../../../../domain/usecases/game/selectWinner/selectWinner';
import { AppState } from '../../../../../store/types';
import { QuestionCard } from '../../../components/domain/QuestionCard';
import { Center } from '../../../components/layout/Center';
import { useAction } from '../../../hooks/useAction';
import { gameSelector, useGame } from '../../../hooks/useGame';
import { playerSelector } from '../../../hooks/usePlayer';
import { fontSize, spacing } from '../../../styles/theme';

const Answer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing(4)};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : undefined)};
`;

const PlayerNick = styled.div`
  font-size: ${fontSize('small')};
`;

const canSelectAnswerSelector = (state: AppState) => {
  const player = playerSelector(state);
  const game = gameSelector(state);

  return game.playState === PlayState.questionMasterSelection && game.questionMaster.nick === player.nick;
};

const isAnswer = (answer: AnonymousAnswer | AnswerType): answer is AnswerType => {
  return 'player' in answer;
};

export const AnswersList: React.FC = () => {
  const game = useGame();

  const handleAnswerClick = useAction(canSelectAnswerSelector, selectWinner);

  return (
    <Center flex={1} padding={2} horizontal={false}>
      {game.answers.map((answer) => (
        <Answer key={answer.id} role="button" onClick={handleAnswerClick ? () => handleAnswerClick(answer) : undefined}>
          <PlayerNick>
            <Route path="/game/:code/started/end-of-turn">{isAnswer(answer) && answer.player.nick}</Route>
            <>&nbsp;</>
          </PlayerNick>
          <QuestionCard question={game.question} choices={answer.choices} />
        </Answer>
      ))}
    </Center>
  );
};
