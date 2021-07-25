import { createFullPlayer, createGame, createPlayer } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';

import { connect } from './connect';

describe('connect', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  beforeEach(() => {
    store.dispatch(setPlayer(createFullPlayer()));
    store.snapshot();
  });

  it('connects to the server', async () => {
    await store.dispatch(connect());

    store.expectPartialState('player', {
      isConnected: true,
    });
  });

  it('listens for an event', async () => {
    const player1 = createPlayer({ nick: 'plouf' });
    const player2 = createPlayer({ nick: 'floup' });

    store.setup(({ dispatch }) => {
      dispatch(setGame(createGame({ players: [player1, player2] })));
    });

    await store.dispatch(connect());
    store.rtcGateway.triggerMessage({ type: 'PlayerConnected', player: 'plouf' });

    store.expectPartialState('game', {
      players: [
        {
          ...player1,
          isConnected: true,
        },
        player2,
      ],
    });
  });
});
