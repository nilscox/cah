import { configureStore } from '../../../store';
import { expectPartialState } from '../../../store/utils';
import { InMemoryGameGateway } from '../../gateways/InMemoryGameGateway';
import { InMemoryPlayerGateway } from '../../gateways/InMemoryPlayerGateway';
import { InMemoryRTCGateway } from '../../gateways/InMemoryRTCGateway';

import { login } from './login';

describe('login', () => {
  it('logs in', async () => {
    const playerGateway = new InMemoryPlayerGateway();
    const gameGateway = new InMemoryGameGateway();
    const rtcGateway = new InMemoryRTCGateway();

    const store = configureStore({ playerGateway, gameGateway, rtcGateway });

    await store.dispatch(login('Toto'));

    expectPartialState(store, 'player', {
      nick: 'Toto',
    });
  });
});
