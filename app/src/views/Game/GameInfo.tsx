import React from 'react';

import { PlayerDTO } from 'dtos/player.dto';
import { GameDTO } from 'dtos/game.dto';
import { TurnDTO } from 'dtos/turn.dto';

import PlayersList from './components/PlayersList';
import Question from './components/Question';

type TurnProps = {
  turn: TurnDTO;
};

const Turn: React.FC<TurnProps> = ({ turn }) => {
  const winner = turn.answers.find(answer => answer.player === turn.winner);

  return (
    <div style={{ margin: '10px 0', fontSize: 12 }}>
      { turn.number }. <Question dense question={turn.question} choices={winner?.choices || []} />
    </div>
  )
};

type GameInfoProps = {
  player: PlayerDTO;
  game: GameDTO;
};

const GameInfo: React.FC<GameInfoProps> = ({ player, game }) => (
  <div style={{ padding: 20, boxSizing: 'border-box' }}>

    <div style={{ margin: '10px 0' }}>Game code: <span style={{ fontWeight: 'bold' }}>{ game.id }</span></div>
    <div style={{ margin: '10px 0' }}>Your nick: <span style={{ fontWeight: 'bold' }}>{ player.nick }</span></div>
    { game.state === 'started' && <div style={{ margin: '10px 0'}}>Question Master: <span style={{ fontWeight: 'bold' }}>{ game.questionMaster }</span></div> }

    <div style={{ marginTop: 25 }}>Players:</div>
    <div style={{ padding: 10 }}>
      <PlayersList game={game} players={game.players} />
    </div>

    { game.turns?.reverse().map(turn => <Turn key={turn.number} turn={turn} />) }

  </div>
);

export default GameInfo;
