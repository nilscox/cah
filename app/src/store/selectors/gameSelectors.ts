import { StartedGame } from '../../domain/entities/Game';
import { Player } from '../../domain/entities/Player';
import { AppState } from '../types';

import { selectIsGameCreator } from './playerSelectors';

export const selectGame = (state: AppState) => state.game as StartedGame;

export const selectCurrentQuestion = (state: AppState) => selectGame(state).question;

export const selectTurns = (state: AppState) => {
  return selectGame(state).turns;
};

export const selectPlayState = (state: AppState) => {
  return selectGame(state).playState;
};

export const selectPlayers = (state: AppState) => {
  return selectGame(state).players;
};

export const selectCanStartGame = (state: AppState) => {
  const game = selectGame(state);
  const isCreator = selectIsGameCreator(state);

  return isCreator && game.players.length >= 3;
};

export const selectScores = (state: AppState): Array<[Player, number]> => {
  const turns = selectTurns(state);
  const players = selectPlayers(state);
  const scores = players.reduce((obj, player) => ({ ...obj, [player.nick]: 0 }), {} as Record<string, number>);

  for (const turn of turns) {
    scores[turn.winner.nick]++;
  }

  const findPlayer = (nick: string) => players.find((player) => player.nick === nick)!;

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([nick, score]) => [findPlayer(nick), score]);
};

export const selectGameWinners = (state: AppState): [Player[], number] | null => {
  const turns = selectTurns(state);
  const scores = selectScores(state);

  if (!turns.length) {
    return null;
  }

  const firstWinner = scores[0];
  const bestScore = firstWinner[1];

  const winners = scores.filter(([, score]) => score === bestScore).map(([player]) => player);

  return [winners, bestScore];
};

export const selectScoresExcludingWinners = (state: AppState) => {
  const scores = selectScores(state);
  const winners = selectGameWinners(state);

  if (!winners) {
    return [];
  }

  const isWinner = (player: Player) => winners[0].some((winner) => winner.nick === player.nick);

  return scores.filter(([player]) => !isWinner(player));
};
