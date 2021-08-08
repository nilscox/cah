import { createChoices, createFullPlayer, createStartedGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { choiceSelected, setGame, setPlayer } from '../../../actions';
import { Choice } from '../../../entities/Choice';

import { flushCards } from './flushCards';

describe('flushCards', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  const setup = (playerCards?: Choice[]) => {
    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(createFullPlayer({ cards: playerCards })));
      dispatch(setGame(createStartedGame()));

      listenRTCMessages();
    });
  };

  it("flushes the player's cards", async () => {
    const oldCards = createChoices(1);
    const newCards = createChoices(1);

    setup(oldCards);
    await store.dispatch(choiceSelected(oldCards[0]));

    store.gameGateway.flushCards = async () => {
      store.rtcGateway.triggerMessage({
        type: 'CardsDealt',
        cards: newCards,
      });
    };

    await store.dispatch(flushCards());

    store.expectPartialState('player', {
      cards: newCards,
      hasFlushed: true,
      selection: [null],
    });
  });

  it('displays a notification', async () => {
    setup();

    await store.dispatch(flushCards());

    store.expectPartialState('app', {
      notification: 'Nouvelles cartes reçues !',
    });
  });
});
