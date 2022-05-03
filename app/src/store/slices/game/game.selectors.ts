import { createSelector } from '@reduxjs/toolkit';

import { isGameStarted } from '../../../domain/entities/game';
import { AppState } from '../../types';

export const selectGameUnsafe = (state: AppState) => {
  return state.game;
};

export const selectGame = createSelector(selectGameUnsafe, (game) => {
  if (game === null) {
    throw new Error(`selectGame: game is null`);
  }

  return game;
});

export const selectPlayers = createSelector(selectGame, (game) => {
  return Object.values(game.players);
});

export const selectGamePlayer = createSelector([selectGame, (_, playerId: string) => playerId], (game, playerId) => {
  return game.players[playerId];
});

export const selectStartedGame = createSelector(selectGame, (game) => {
  if (!isGameStarted(game)) {
    throw new Error(`selectGame: game is not started`);
  }

  return game;
});

export const selectQuestionMaster = createSelector(selectStartedGame, (game) => {
  return game.players[game.questionMaster];
});

export const selectPlayersExcludingQuestionMaster = createSelector(
  selectQuestionMaster,
  selectPlayers,
  (questionMaster, players) => {
    return players.filter((player) => player.id !== questionMaster.id);
  },
);

export const selectQuestion = createSelector(selectStartedGame, (game) => {
  return game.question;
});

export const selectAnswers = createSelector(selectStartedGame, (game) => {
  return game.answers;
});

export const selectWinner = createSelector(selectStartedGame, (game) => {
  if (!game.winner) {
    return undefined;
  }

  return game.players[game.winner];
});

export const selectTurns = createSelector(selectGame, (game) => {
  return game.turns;
});
