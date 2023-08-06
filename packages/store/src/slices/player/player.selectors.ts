import { assert } from '@cah/utils';
import { createSelector } from 'reselect';

import { defined } from '../../defined';
import { AppState } from '../../types';
import { choicesSelectors } from '../choices/choices.selectors';

const hasPlayer = (state: AppState) => state.player !== null;
const player = (state: AppState) => defined(state.player);

const cards = createSelector([player, (state: AppState) => state], (player, state) => {
  assert(player.cardsIds);
  return choicesSelectors.byIds(state, player.cardsIds);
});

const selectedChoices = createSelector([player, choicesSelectors.choices], (player, choices) => {
  assert(player.selectedChoicesIds);

  return player.selectedChoicesIds.map((choiceId) => {
    if (choiceId === null) return null;
    else return defined(choices[choiceId]);
  });
});

export const playerSelectors = {
  hasPlayer,
  player,
  cards,
  selectedChoices,
};
