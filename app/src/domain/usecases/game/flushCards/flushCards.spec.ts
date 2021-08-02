import { createChoices, createFullPlayer, createStartedGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';

import { flushCards } from './flushCards';

describe('flushCards', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it("flushes the player's cards", async () => {
    const oldCards = createChoices(1);
    const newCards = createChoices(1);

    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(createFullPlayer({ cards: oldCards })));
      dispatch(setGame(createStartedGame()));

      listenRTCMessages();
    });

    store.gameGateway.flushCards = async () => {
      store.rtcGateway.triggerMessage({
        type: 'CardsDealt',
        cards: newCards,
      });
    };

    await store.dispatch(flushCards());

    store.expectPartialState('player', {
      cards: newCards,
    });
  });

  it('displays a notification', async () => {
    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(createStartedGame()));

      listenRTCMessages();
    });

    await store.dispatch(flushCards());

    store.expectPartialState('app', {
      notification: 'Nouvelles cartes reçues !',
    });
  });
});
