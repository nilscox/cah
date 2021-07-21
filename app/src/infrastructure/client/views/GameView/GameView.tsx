import React from 'react';

import { Redirect, RouteComponentProps } from 'react-router-dom';

import { useGame } from '../../hooks/useGame';

type RouteParams = {
  gameCode: string;
};

const GameView: React.FC<RouteComponentProps<RouteParams>> = ({ match: { params } }) => {
  const game = useGame();

  if (params.gameCode !== game.code) {
    return <Redirect to={`/game/${game.code}`} />;
  }

  return <>Game {params.gameCode}</>;
};

export default GameView;
