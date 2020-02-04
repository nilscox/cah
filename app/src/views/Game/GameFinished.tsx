import React from 'react';

import { GameDTO } from 'dtos/game.dto';

type GameFinishedProps = {
  game: GameDTO;
};

const GameFinished: React.FC<GameFinishedProps> = ({ game }) => {
  return (
    <>
      finished
    </>
  );
};

export default GameFinished;
