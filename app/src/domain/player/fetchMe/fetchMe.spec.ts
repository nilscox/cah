import { configureStore } from '../../../store';
import { expectPartialState, expectState } from '../../../store/utils';
import { InMemoryGameGateway } from '../../gateways/InMemoryGameGateway';
import { InMemoryPlayerGateway } from '../../gateways/InMemoryPlayerGateway';
import { InMemoryRTCGateway } from '../../gateways/InMemoryRTCGateway';

import { fetchMe } from './fetchMe';

describe('fetchMe', () => {
  it('fetches the player currently logged in', async () => {
    const playerGateway = new InMemoryPlayerGateway();
    const gameGateway = new InMemoryGameGateway();
    const rtcGateway = new InMemoryRTCGateway();

    const store = configureStore({ playerGateway, gameGateway, rtcGateway });

    await store.dispatch(fetchMe());

    expectPartialState(store, 'player', {});
    expectState(store, 'app', { ready: true });
  });
});
