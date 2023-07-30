import { createSelector } from '@reduxjs/toolkit';

import { defined } from '../../defined';
import { AppState } from '../../types';
import { answersSelectors } from '../answers/answers.selectors';

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

const answers = createSelector([game, (state: AppState) => state], (game, state) => {
  assert(isStarted(game));
  return answersSelectors.byIds(state, game.answersIds);
});

export const gameSelectors = {
  game,
  code,
  startedGame,
  isQuestionMaster,
  answers,
};
