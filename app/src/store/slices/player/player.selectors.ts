import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../types';

export const selectPlayer = (state: AppState) => {
  return state.player;
};

export const selectPlayerGame = createSelector(selectPlayer, (player) => {
  if (!player.game) {
    throw new Error('selectPlayerGame: player is not in game');
  }

  return player.game;
});

export const selectPlayerCards = createSelector(selectPlayerGame, (game) => {
  return Object.values(game.cards);
});

export const selectPlayerChoicesSelection = createSelector(selectPlayerGame, (game) => {
  return game.selection.map((choiceId) => (choiceId ? game.cards[choiceId] : null));
});

export const selectPlayerSelectionFirstBlankIndex = createSelector(selectPlayerChoicesSelection, (selection) => {
  return selection.indexOf(null);
});
