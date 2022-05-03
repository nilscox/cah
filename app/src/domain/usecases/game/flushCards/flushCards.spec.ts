import expect from 'expect';

import { first } from '../../../../shared/first';
import {
  selectPlayerCards,
  selectPlayerChoicesSelection,
  selectPlayerGame,
} from '../../../../store/slices/player/player.selectors';
import { createChoices, createQuestion } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { choiceSelected } from '../../../actions';
import { Choice } from '../../../entities/Choice';

import { flushCards } from './flushCards';

describe('flushCards', () => {
  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer())
    .apply(TestBuilder.createGame())
    .apply(TestBuilder.startGame())
    .getStore();

  it("replaces all the player's cards with new ones", async () => {
    const oldCards = store.select(selectPlayerCards);
    const newCards = createChoices(11);

    store.dispatch(TestBuilder.setPlayerCards(oldCards));

    store.gameGateway.flushCards.mockImplementation(async () => {
      store.rtcGateway.triggerMessage({
        type: 'CardsDealt',
        cards: newCards,
      });
    });

    await store.dispatch(flushCards());

    expect(store.select(selectPlayerCards)).toEqual(newCards);
    expect(store.select(selectPlayerGame)).toHaveProperty('hasFlushed', true);
  });

  it("clears the player's current selection", async () => {
    const cards = store.select(selectPlayerCards);

    store.dispatch(TestBuilder.setQuestion(createQuestion({ numberOfBlanks: 2 })));
    store.dispatch(choiceSelected(first(cards) as Choice));

    await store.dispatch(flushCards());

    expect(store.select(selectPlayerChoicesSelection)).toEqual([null, null]);
  });

  it('displays a notification', async () => {
    await store.dispatch(flushCards());

    expect(store.app.notification).toEqual('Nouvelles cartes reçues !');
  });
});
