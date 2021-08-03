import React from 'react';

import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';

import { leaveGame } from '../../../../domain/usecases/game/leaveGame/leaveGame';
import { selectGameWinners, selectScoresExcludingWinners } from '../../../../store/selectors/gameSelectors';
import { NotNull } from '../../../../store/types';
import Button from '../../components/elements/Button';
import { Center } from '../../components/layout/Center';
import { FadeIn } from '../../components/layout/Fade';
import { Flex } from '../../components/layout/Flex';
import { fontSize, spacing } from '../../styles/theme';

const Winners = styled(Center)`
  font-size: ${fontSize('big')};
`;

const Winner = styled.div`
  margin: ${spacing(2, 0)};
`;

const Scores = styled.div`
  margin: ${spacing(2, 0)};
`;

const notNull = <T extends unknown>(value: T | null): NotNull<T> => {
  // could happen in storybook
  if (value === null) {
    throw new Error('there is no winner');
  }

  return value as NotNull<T>;
};

export const GameFinishedView: React.FC = () => {
  const dispatch = useDispatch();

  const [winners, bestScore] = notNull(useSelector(selectGameWinners));
  const scores = useSelector(selectScoresExcludingWinners);

  return (
    <>
      <Flex flex={1} padding={2}>
        <Center minHeight={24}>
          <FadeIn duration="slow">{winners.length === 1 ? 'Et le gagnant est...' : 'Et les gagnants sont...'}</FadeIn>
          <FadeIn appear={false} delay={8}>
            <Winners>
              {winners.map((winner) => (
                <Winner key={winner.nick}>{winner.nick}</Winner>
              ))}
            </Winners>
          </FadeIn>
        </Center>
        <FadeIn delay={12}>
          Avec {bestScore} point{bestScore > 1 ? 's' : ''} !<br />
          Suivi par :
          <Scores>
            {scores.map(([player, score]) => (
              <div key={player.nick}>
                {player.nick}: {score}
              </div>
            ))}
          </Scores>
        </FadeIn>
      </Flex>
      <FadeIn delay={20}>
        <Center minHeight={12}>
          <Button onClick={() => dispatch(leaveGame())}>Quitter la partie</Button>
        </Center>
      </FadeIn>
    </>
  );
};
