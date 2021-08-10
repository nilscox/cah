import React from 'react';

import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { leaveGame } from '../../../../domain/usecases/game/leaveGame/leaveGame';
import { selectGameWinners, selectScoresExcludingWinners } from '../../../../store/selectors/gameSelectors';
import { NotNull } from '../../../../store/types';
import Button from '../../components/elements/Button';
import { BottomAction } from '../../components/layout/BottomAction';
import { Center } from '../../components/layout/Center';
import { FadeIn, FadeInProps } from '../../components/layout/Fade';
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

const MaybeFadeIn: React.FC<FadeInProps> = ({ ...props }) => {
  const location = useLocation<{ animations?: true }>();

  if (location.state?.animations) {
    return <FadeIn {...props} />;
  }

  return <div>{props.children}</div>;
};

export const GameFinishedView: React.FC = () => {
  const dispatch = useDispatch();

  const [winners, bestScore] = notNull(useSelector(selectGameWinners));
  const scores = useSelector(selectScoresExcludingWinners);

  const winner = (
    <Center minHeight={24}>
      <MaybeFadeIn duration="slow">
        {winners.length === 1 ? 'Et le gagnant est...' : 'Et les gagnants sont...'}
      </MaybeFadeIn>
      <MaybeFadeIn appear={false} delay={8}>
        <Winners>
          {winners.map((winner) => (
            <Winner key={winner.nick}>{winner.nick}</Winner>
          ))}
        </Winners>
      </MaybeFadeIn>
    </Center>
  );

  const players = (
    <MaybeFadeIn delay={12}>
      Avec {bestScore} point{bestScore > 1 ? 's' : ''} !<br />
      {scores.length > 0 && (
        <>
          Suivi par :
          <Scores>
            {scores.map(([player, score]) => (
              <div key={player.nick}>
                {player.nick}: {score}
              </div>
            ))}
          </Scores>
        </>
      )}
    </MaybeFadeIn>
  );

  return (
    <>
      <Flex flex={1} padding={2}>
        {winner}
        {players}
      </Flex>
      <MaybeFadeIn delay={20}>
        <BottomAction visible>
          <Button onClick={() => dispatch(leaveGame())}>Quitter la partie</Button>
        </BottomAction>
      </MaybeFadeIn>
    </>
  );
};
