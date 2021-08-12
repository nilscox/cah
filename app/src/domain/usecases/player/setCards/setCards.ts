import { sortBy } from 'lodash';

import { createThunk } from '../../../../store/createThunk';
import { setPlayerCards } from '../../../actions';
import { Choice } from '../../../entities/Choice';

const reorderCards = createThunk(({ persistenceGateway }, cards: Choice[]) => {
  const persistedCardsIds = persistenceGateway.getItem<string[]>('cards') ?? [];

  return sortBy(cards, ({ id }) => persistedCardsIds.indexOf(id));
});

const persistCards = createThunk(({ persistenceGateway }, cards: Choice[]) => {
  persistenceGateway.setItem(
    'cards',
    cards.map(({ id }) => id),
  );
});

// arguments with default values are not supported due to createThunk's typing
export const setCards = createThunk(({ dispatch }, cards: Choice[], reorder?: boolean) => {
  const orderedCards = reorder === false ? cards : dispatch(reorderCards(cards));

  dispatch(setPlayerCards(orderedCards));
  dispatch(persistCards(orderedCards));
});
