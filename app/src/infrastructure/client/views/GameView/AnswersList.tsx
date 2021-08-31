import React from 'react';

import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';

import { PlayState } from '../../../../../../shared/enums';
import { isNotAnonymous } from '../../../../domain/entities/Answer';
import { nextTurn } from '../../../../domain/usecases/game/nextTurn/nextTurn';
import { selectWinner } from '../../../../domain/usecases/game/selectWinner/selectWinner';
import { selectGame, selectIsLastTurn, selectIsWinningAnswer } from '../../../../store/selectors/gameSelectors';
import { selectIsQuestionMaster } from '../../../../store/selectors/playerSelectors';
import { AppState } from '../../../../store/types';
import { QuestionCard } from '../../components/domain/QuestionCard';
import Button from '../../components/elements/Button';
import { Icon } from '../../components/elements/Icon';
import { BottomAction } from '../../components/layout/BottomAction';
import { Box } from '../../components/layout/Box';
import { Center } from '../../components/layout/Center';
import { Fade } from '../../components/layout/Fade';
import { useAction } from '../../hooks/useAction';
import { useGame } from '../../hooks/useGame';
import Trophy from '../../icons/trophy.svg';
import { fontSize, spacing } from '../../styles/theme';
import { conditionalCallback } from '../utils/utils';

const Answer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing(4)};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : undefined)};
`;

const PlayerNick = styled(Fade)`
  font-size: ${fontSize('small')};
`;

const WinnerIcon = styled(Icon)`
  margin-left: ${spacing(1)};
  vertical-align: top;
`;

const canSelectAnswerSelector = (state: AppState) => {
  const game = selectGame(state);
  const isQuestionMaster = selectIsQuestionMaster(state);

  return game.playState === PlayState.questionMasterSelection && isQuestionMaster;
};

const canEndTurnSelector = (state: AppState) => {
  const game = selectGame(state);
  const isQuestionMaster = selectIsQuestionMaster(state);

  return game.playState === PlayState.endOfTurn && isQuestionMaster;
};

export const AnswersList: React.FC = () => {
  const game = useGame();

  const isLastTurn = useSelector(selectIsLastTurn);
  const isWinningAnswer = useSelector(selectIsWinningAnswer);

  const handleAnswerClick = useAction(canSelectAnswerSelector, selectWinner);
  const handleNextTurn = useAction(canEndTurnSelector, nextTurn);

  return (
    <>
      <Center flex={1} padding={2} horizontal={false} overflowY="auto">
        {game.answers?.map((answer) => (
          <Answer key={answer.id} role="button" onClick={conditionalCallback(handleAnswerClick, answer)}>
            <PlayerNick appear show={isNotAnonymous(answer)}>
              {isNotAnonymous(answer) ? answer.player.nick : <>&nbsp;</>}
              {isWinningAnswer(answer) && <WinnerIcon as={Trophy} size={2} />}
            </PlayerNick>
            <Box marginLeft={2}>
              <QuestionCard question={game.question} choices={answer.choices} />
            </Box>
          </Answer>
        ))}
      </Center>
      <BottomAction visible={handleNextTurn !== undefined}>
        <Route path="/game/:code/started/end-of-turn">
          <Button onClick={handleNextTurn}>{isLastTurn ? 'Terminer la partie' : 'Prochaine question'}</Button>
        </Route>
      </BottomAction>
    </>
  );
};
