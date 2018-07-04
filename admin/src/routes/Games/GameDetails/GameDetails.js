// @flow

import * as React from 'react';

type GameDetailsProps = {
  games: Game,
};

const GameDetails = ({ game }: GameDetailsProps) => (
  <div>
    { JSON.stringify(game) }
  </div>
);

export default GameDetails;
