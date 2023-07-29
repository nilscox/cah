import { createSelector } from 'reselect';

import { defined } from '../../defined';
import { AppState } from '../../types';
import { choicesSelectors } from '../choices/choices.selectors';

const hasPlayer = (state: AppState) => state.player !== null;
const player = (state: AppState) => defined(state.player);

const selectedChoices = createSelector([player, (state: AppState) => state], (player, state) => {
  return choicesSelectors.byIds(state, player.selectedChoicesIds);
});

export const playerSelectors = {
  hasPlayer,
  player,
  selectedChoices,
};
