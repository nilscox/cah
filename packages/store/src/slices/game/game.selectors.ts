import { createSelector } from '@reduxjs/toolkit';

import { defined } from '../../defined';
import { AppState } from '../../types';

import { isStarted } from './game.slice';

const game = (state: AppState) => defined(state.game);

const code = createSelector(game, (game) => {
  return game.code;
});

const startedGame = createSelector(game, (game) => {
  assert(isStarted(game));
  return game;
});

const isQuestionMaster = createSelector([game, (game, playerId: string) => playerId], (game, playerId) => {
  return isStarted(game) && playerId === game.questionMasterId;
});

export const gameSelectors = {
  game,
  code,
  startedGame,
  isQuestionMaster,
};
