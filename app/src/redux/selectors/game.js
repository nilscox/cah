import { createSelector } from 'reselect';

export const gameSelector = (state) => state.game;

export const gameStateSelector = createSelector(
  gameSelector,
  game => game.state,
);

export const gameQuestionSelector = createSelector(
  gameSelector,
  game => game.question,
);
