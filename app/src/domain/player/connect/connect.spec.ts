import { configureStore } from '../../../store';
import { expectPartialState } from '../../../store/utils';
import { createPlayer } from '../../../utils/factories';
import { setPlayer } from '../../actions';
import { InMemoryGameGateway } from '../../gateways/InMemoryGameGateway';
import { InMemoryPlayerGateway } from '../../gateways/InMemoryPlayerGateway';
import { InMemoryRTCGateway } from '../../gateways/InMemoryRTCGateway';

import { connect } from './connect';

describe('connect', () => {
  it('connects to the server', async () => {
    const playerGateway = new InMemoryPlayerGateway();
    const gameGateway = new InMemoryGameGateway();
    const rtcGateway = new InMemoryRTCGateway();

    const store = configureStore({ playerGateway, gameGateway, rtcGateway });

    store.dispatch(setPlayer(createPlayer()));

    await store.dispatch(connect());

    expectPartialState(store, 'player', {
      isConnected: true,
    });
  });
});
