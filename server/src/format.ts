import { Answer, Turn, Game } from './types/Game';
import { Player } from './types/Player';

import { AnswerDTO } from 'dtos/answer.dto';
import { TurnDTO } from 'dtos/turn.dto';
import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';

export const formatPlayer = (player: Player, full = false): PlayerDTO => {
  const result: PlayerDTO = {
    nick: player.nick,
    connected: !!player.socket,
  };

  if (full && player.cards) {
    result.cards = player.cards;

    if (player.answer)
      result.selection = player.answer?.choices;
  }

  return result;
}

export const formatGame = (game: Game, full = false): GameDTO => {
  const result: GameDTO = {
    id: game.id,
    state: game.state,
    players: game.players.map(p => formatPlayer(p)),
  };

  if (game.state === 'started') {
    result.playState = game.playState;
    result.questionMaster = game.questionMaster;
    result.question = game.question;
    result.answered = game.answers!.map(a => a.player);
    result.turn = game.turns!.length + 1;

    if (game.playState === 'question_master_selection')
      result.answers = game.answers!.map(a => ({ choices: a.choices }));
  }

  if (game.state === 'finished') {
    result.scores = game.scores;
  }

  if (full) {
    if (game.turns)
      result.turns = game.turns.map(formatTurn);
  }

  return result;
};

export const formatAnswer = (answer: Answer): AnswerDTO => ({
  player: answer.player,
  choices: answer.choices,
});

export const formatTurn = (turn: Turn): TurnDTO => ({
  number: turn.number,
  questionMaster: turn.questionMaster,
  question: turn.question,
  winner: turn.winner,
  answers: turn.answers.map(formatAnswer),
});
