import expect from 'expect';

import { selectPlayerCards } from '../../../../store/slices/player/player.selectors';
import { createChoices } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handleCardsDealt', () => {
  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer())
    .apply(TestBuilder.createGame())
    .apply(TestBuilder.startGame())
    .getStore();

  it("add the new cards to the player's hand", () => {
    const cards = createChoices(2);

    store.dispatch(TestBuilder.setPlayerCards([]));

    store.dispatch(
      handleRTCMessage({
        type: 'CardsDealt',
        cards,
      }),
    );

    expect(store.select(selectPlayerCards)).toEqual(cards);
  });
});
