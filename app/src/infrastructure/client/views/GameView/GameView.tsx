import React from 'react';

import { Redirect, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { Icon } from '../../components/Icon';
import { View } from '../../components/View';
import { usePlayer } from '../../hooks/player';
import { useGame } from '../../hooks/useGame';
import Menu from '../../icons/menu.svg';
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

type RouteParams = {
  gameCode: string;
};

const GameView: React.FC<RouteComponentProps<RouteParams>> = ({ match: { params } }) => {
  const player = usePlayer();
  const game = useGame();

  if (params.gameCode !== game.code) {
    return <Redirect to={`/game/${game.code}`} />;
  }

  return (
    <View player={player} icon={<Icon as={Menu} />}>
      <GameCode>{params.gameCode}</GameCode>
      <p>Attendez que tous les joueurs soient listés ci-dessous, et cliquez sur démarrer pour lancer la partie.</p>
      <PlayersList>
        {game.players.map((player) => (
          <PlayerItem key={player.nick} connected={player.isConnected}>
            {player.nick}
          </PlayerItem>
        ))}
      </PlayersList>
    </View>
  );
};

export default GameView;
