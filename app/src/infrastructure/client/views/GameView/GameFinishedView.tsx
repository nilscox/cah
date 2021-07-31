import React from 'react';

import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from 'reflexbox';

import { leaveGame } from '../../../../domain/usecases/game/leaveGame/leaveGame';
import { selectGameWinners, selectScoresExcludingWinners } from '../../../../store/selectors/gameSelectors';
import Button from '../../components/elements/Button';
import { Center } from '../../components/layout/Center';
import { FadeIn } from '../../components/layout/FadeIn';
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

export const GameFinishedView: React.FC = () => {
  const dispatch = useDispatch();

  const [winners, bestScore] = useSelector(selectGameWinners)!;
  const scores = useSelector(selectScoresExcludingWinners);

  return (
    <>
      <Flex flex={1} padding={2}>
        <Center minHeight={24}>
          <FadeIn factor={10}>{winners.length === 1 ? 'Et le gagnant est...' : 'Et les gagnants sont...'}</FadeIn>
          <FadeIn factor={0} delay={10}>
            <Winners>
              {winners.map((winner) => (
                <Winner key={winner.nick}>{winner.nick}</Winner>
              ))}
            </Winners>
          </FadeIn>
        </Center>
        <FadeIn delay={14}>
          Avec {bestScore} point{bestScore > 1 ? 's' : ''} !<br />
          Suivi par :
        </FadeIn>
        <FadeIn delay={14}>
          <Scores>
            {scores.map(([player, score]) => (
              <Box key={player.nick}>
                {player.nick}: {score}
              </Box>
            ))}
          </Scores>
        </FadeIn>
      </Flex>
      <FadeIn delay={20}>
        <Center minHeight={24}>
          <Button onClick={() => dispatch(leaveGame())}>Quitter la partie</Button>
        </Center>
      </FadeIn>
    </>
  );
};
