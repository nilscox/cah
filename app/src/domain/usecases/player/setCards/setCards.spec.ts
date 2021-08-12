import { expect } from 'earljs';
import { reverse, slice } from 'lodash';

import { createChoices, createFullPlayer } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setPlayer } from '../../../actions';
import { Choice } from '../../../entities/Choice';

import { setCards } from './setCards';

describe('setCards', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();

    store.setup(({ dispatch }) => {
      dispatch(setPlayer(createFullPlayer()));
    });
  });

  const persistCards = (cards: Choice[]) => {
    store.persistenceGateway.setItem(
      'cards',
      cards.map(({ id }) => id),
    );
  };

  const expectPersistedCards = (cards: Choice[]) => {
    expect(store.persistenceGateway.getItem('cards')).toEqual(cards.map(({ id }) => id));
  };

  it("sets the player's cards", () => {
    const cards = createChoices(2);

    store.dispatch(setCards(cards));

    store.expectPartialState('player', {
      cards,
    });
  });

  it("persists the player's cards", () => {
    const cards = createChoices(2);

    store.dispatch(setCards(cards));

    expectPersistedCards(cards);
  });

  it("reorders the player's cards according to the persisted order", () => {
    const cards = createChoices(3);

    const test = (persisted: Choice[], expected: Choice[]) => {
      persistCards(persisted);

      store.dispatch(setCards(cards));

      store.expectPartialState('player', {
        cards: expected,
      });
    };

    test([], cards);
    test(cards, cards);
    test(reverse(slice(cards)), reverse(slice(cards)));
    test([cards[0], cards[2]], [cards[1], cards[0], cards[2]]);
  });

  it("saves the players's cards without reordering them", () => {
    const cards = createChoices(3);

    persistCards(reverse(slice(cards)));

    store.dispatch(setCards(cards, false));

    store.expectPartialState('player', {
      cards,
    });

    expectPersistedCards(cards);
  });
});
