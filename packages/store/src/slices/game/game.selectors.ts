import { createSelector } from '@reduxjs/toolkit';

import { defined } from '../../defined';
import { AppState } from '../../types';

const game = (state: AppState) => defined(state.game);
const code = createSelector(game, (game) => game.code);

export const gameSelectors = {
  game,
  code,
};
