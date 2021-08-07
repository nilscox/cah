import React from 'react';

import styled from '@emotion/styled';
import { Route } from 'react-router-dom';

import { PlayState } from '../../../../../../shared/enums';
import { AnonymousAnswer, Answer } from '../../../../domain/entities/Answer';
import { nextTurn } from '../../../../domain/usecases/game/nextTurn/nextTurn';
import { selectWinner } from '../../../../domain/usecases/game/selectWinner/selectWinner';
import { selectGame } from '../../../../store/selectors/gameSelectors';
import { selectIsQuestionMaster } from '../../../../store/selectors/playerSelectors';
import { AppState } from '../../../../store/types';
import { QuestionCard } from '../../components/domain/QuestionCard';
import Button from '../../components/elements/Button';
import { Icon } from '../../components/elements/Icon';
import { Box } from '../../components/layout/Box';
import { Center } from '../../components/layout/Center';
import { FadeIn } from '../../components/layout/Fade';
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

const PlayerNick = styled(FadeIn)`
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

  const handleAnswerClick = useAction(canSelectAnswerSelector, selectWinner);
  const handleNextTurn = useAction(canEndTurnSelector, nextTurn);

  const isWinner = (answer: AnonymousAnswer) => game.winner?.nick === answer?.player?.nick;

  return (
    <>
      <Center flex={1} padding={2} horizontal={false}>
        {game.answers.map((answer) => (
          <Answer key={answer.id} role="button" onClick={conditionalCallback(handleAnswerClick, answer)}>
            <PlayerNick>
              {answer.player?.nick ?? '&nbsp;'}
              {isWinner(answer) && <WinnerIcon as={Trophy} size={2} />}
            </PlayerNick>
            <Box marginLeft={2}>
              <QuestionCard question={game.question} choices={answer.choices} />
            </Box>
          </Answer>
        ))}
      </Center>
      <Center minHeight={12}>
        <Route path="/game/:code/started/end-of-turn">
          {handleNextTurn && <Button onClick={handleNextTurn}>Prochaine question</Button>}
        </Route>
      </Center>
    </>
  );
};
