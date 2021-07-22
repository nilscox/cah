import React from 'react';

import { useGame } from '../../hooks/useGame';

export const GameStarted: React.FC = () => {
  const game = useGame();

  return <>La partie est démarrée !</>;
};
