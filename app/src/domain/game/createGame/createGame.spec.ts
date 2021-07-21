import { GameState } from '../../../interfaces/entities/Game';
import { configureStore } from '../../../store';
import { expectState } from '../../../store/utils';
import { InMemoryGameGateway } from '../../gateways/InMemoryGameGateway';
import { InMemoryPlayerGateway } from '../../gateways/InMemoryPlayerGateway';
import { InMemoryRTCGateway } from '../../gateways/InMemoryRTCGateway';

import { createGame } from './createGame';

describe('createGame', () => {
  it('creates a game', async () => {
    const playerGateway = new InMemoryPlayerGateway();
    const gameGateway = new InMemoryGameGateway();
    const rtcGateway = new InMemoryRTCGateway();

    const store = configureStore({ playerGateway, gameGateway, rtcGateway });

    await store.dispatch(createGame());

    expectState(store, 'game', {
      id: 'id',
      code: 'OK42',
      state: GameState.idle,
      players: [],
    });
  });
});
