import { AppStore } from '../../../store/types';
import { expectPartialState, inMemoryStore } from '../../../store/utils';
import { createGame, createPlayer } from '../../../utils/factories';
import { setGame, setPlayer } from '../../actions';
import { InMemoryRTCGateway } from '../../gateways/InMemoryRTCGateway';

import { connect } from './connect';

describe('connect', () => {
  let rtcGateway: InMemoryRTCGateway;

  let store: AppStore;

  beforeEach(() => {
    rtcGateway = new InMemoryRTCGateway();

    store = inMemoryStore({ rtcGateway });

    store.dispatch(setPlayer(createPlayer()));
  });

  it('connects to the server', async () => {
    await store.dispatch(connect());

    expectPartialState(store, 'player', {
      isConnected: true,
    });
  });

  it('listens for an event', async () => {
    const player1 = createPlayer({ nick: 'plouf' });
    const player2 = createPlayer({ nick: 'floup' });

    store.dispatch(setGame(createGame({ players: [player1, player2] })));

    await store.dispatch(connect());
    rtcGateway.triggerMessage({ type: 'PlayerConnected', player: 'plouf' });

    expectPartialState(store, 'game', {
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
