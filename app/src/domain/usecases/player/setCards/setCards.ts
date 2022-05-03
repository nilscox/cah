import { sortBy } from 'lodash';

import { getIds } from '../../../../shared/getIds';
import { createThunk } from '../../../../store/createThunk';
import { playerActions } from '../../../../store/slices/player/player.actions';
import { Choice } from '../../../entities/Choice';

const reorderCards = createThunk(({ persistenceGateway }, cards: Choice[]) => {
  const persistedCardsIds = persistenceGateway.getItem<string[]>('cards') ?? [];

  return sortBy(cards, ({ id }) => persistedCardsIds.indexOf(id));
});

const persistCards = createThunk(({ persistenceGateway }, cards: Choice[]) => {
  persistenceGateway.setItem('cards', getIds(cards));
});

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const setCards = createThunk(({ dispatch }, cards: Choice[], reorder: boolean = false) => {
  const orderedCards = reorder ? dispatch(reorderCards(cards)) : cards;

  dispatch(playerActions.addChoices(orderedCards));
  dispatch(persistCards(orderedCards));
});
