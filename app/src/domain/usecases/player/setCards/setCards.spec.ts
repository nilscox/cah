import expect from 'expect';
import { reverse } from 'lodash';

import { getIds } from '../../../../shared/getIds';
import { selectPlayerCards } from '../../../../store/slices/player/player.selectors';
import { createChoices } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';

import { setCards } from './setCards';

describe('setCards', () => {
  const store = new TestBuilder().apply(TestBuilder.setPlayer()).apply(TestBuilder.createGame()).getStore();
  const cards = createChoices(2);

  it("sets the player's cards", () => {
    store.dispatch(setCards(cards));

    expect(store.select(selectPlayerCards)).toEqual(cards);
  });

  it("sets the player's cards without reordering them by default", () => {
    store.persistenceGateway.setItem('cards', reverse(getIds(cards)));

    store.dispatch(setCards(cards));

    expect(store.select(selectPlayerCards)).toEqual(cards);
  });

  it("sets the player's cards and reorder them", () => {
    store.persistenceGateway.setItem('cards', reverse(getIds(cards)));

    store.dispatch(setCards(cards, true));

    expect(store.select(selectPlayerCards)).toEqual(reverse(cards));
  });

  it("persists the player's cards ordering", () => {
    store.dispatch(setCards(cards));

    expect(store.persistenceGateway.getItem('cards')).toEqual(getIds(cards));
  });
});
