import React from 'react';

import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { startGame } from '../../../../domain/usecases/game/startGame/startGame';
import Button from '../../components/elements/Button';
import { Center } from '../../components/layout/Center';
import { useGame } from '../../hooks/useGame';
import { usePlayer } from '../../hooks/usePlayer';
import { fontSize, spacing } from '../../styles/theme';

const GameCode = styled.div`
  margin: ${spacing(4, 'auto', 6)};
  font-size: ${fontSize('title')};
`;

const PlayersList = styled.ul``;

const PlayerItem = styled.li<{ connected: boolean }>`
  color: ${({ connected }) => (connected ? undefined : 'red')};
  opacity: ${({ connected }) => (connected ? 1 : 0.7)};
`;

export const GameIdleView: React.FC = () => {
  const dispatch = useDispatch();
  const game = useGame();
  const player = usePlayer();

  return (
    <>
      <GameCode>{game.code}</GameCode>
      <p>Attendez que tous les joueurs soient listés ci-dessous, et cliquez sur démarrer pour lancer la partie.</p>
      <PlayersList>
        {game.players.map((player) => (
          <PlayerItem key={player.nick} connected={player.isConnected}>
            {player.nick}
          </PlayerItem>
        ))}
      </PlayersList>
      <Center>
        <Button onClick={() => dispatch(startGame(player, 10))}>Démarrer</Button>
      </Center>
    </>
  );
};
