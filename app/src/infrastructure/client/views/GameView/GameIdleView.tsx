import React from 'react';

import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';

import { startGame } from '../../../../domain/usecases/game/startGame/startGame';
import { selectGame } from '../../../../store/selectors/gameSelectors';
import { AppState } from '../../../../store/types';
import Button from '../../components/elements/Button';
import { Center } from '../../components/layout/Center';
import { Fade } from '../../components/layout/Fade';
import { Flex } from '../../components/layout/Flex';
import { useGame } from '../../hooks/useGame';
import { usePlayer } from '../../hooks/usePlayer';
import { fontSize } from '../../styles/theme';

const GameCode = styled(Center)`
  font-size: ${fontSize('title')};
`;

const PlayersList = styled.ul``;

const PlayerItem = styled.li<{ connected: boolean }>`
  color: ${({ connected }) => (connected ? undefined : 'red')};
  opacity: ${({ connected }) => (connected ? 1 : 0.7)};
`;

const selectCanStartGame = (state: AppState) => {
  const game = selectGame(state);

  return game.players.length >= 3;
};

export const GameIdleView: React.FC = () => {
  const dispatch = useDispatch();
  const canStart = useSelector(selectCanStartGame);

  const game = useGame();
  const player = usePlayer();

  return (
    <>
      <Flex flex={1} padding={2}>
        <GameCode minHeight={12}>{game.code}</GameCode>
        <p>Attendez que tous les joueurs soient listés ci-dessous, et cliquez sur démarrer pour lancer la partie.</p>
        <PlayersList>
          {game.players.map((player) => (
            <PlayerItem key={player.nick} connected={player.isConnected}>
              {player.nick}
            </PlayerItem>
          ))}
        </PlayersList>
      </Flex>
      <Center minHeight={24}>
        <Fade appear show={canStart}>
          <Button onClick={() => dispatch(startGame(player, 10))}>Démarrer</Button>
        </Fade>
      </Center>
    </>
  );
};
