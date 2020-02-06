import React from 'react';

import { GameDTO } from 'dtos/game.dto';

import PlayersList from './components/PlayersList';
import { TurnDTO } from 'dtos/turn.dto';
import Question from './Question';

type TurnProps = {
  turn: TurnDTO;
};

const Turn: React.FC<TurnProps> = ({ turn }) => {
  const winner = turn.answers.find(answer => answer.player === turn.winner);

  return (
    <>
      { turn.number }. <Question question={turn.question} choices={winner?.choices || []} />
    </>
  )
};

type GameInfoProps = {
  game: GameDTO;
};

const GameInfo: React.FC<GameInfoProps> = ({ game }) => (
  <div style={{ padding: 20, boxSizing: 'border-box' }}>
    <div style={{ padding: 10, marginBottom: 20, border: '1px solid #789' }}>
      <PlayersList game={game} players={game.players} />
    </div>
    { game.turns?.map(turn => <Turn key={turn.number} turn={turn} />) }
  </div>
);

export default GameInfo;
