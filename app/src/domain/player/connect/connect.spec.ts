import expect from 'expect';

import { Player } from '../../../interfaces/entities/Player';
import { configureStore } from '../../../store';
import { InMemoryGameGateway } from '../../gateways/InMemoryGameGateway';
import { InMemoryPlayerGateway } from '../../gateways/InMemoryPlayerGateway';
import { InMemoryRTCGateway } from '../../gateways/InMemoryRTCGateway';
import { setPlayer } from '../login/login';

import { connect } from './connect';

const createPlayer = (nick = 'player'): Player => ({
  id: 'id',
  nick,
  isConnected: false,
});

describe('connect', () => {
  it('connects to the server', async () => {
    const playerGateway = new InMemoryPlayerGateway();
    const gameGateway = new InMemoryGameGateway();
    const rtcGateway = new InMemoryRTCGateway();

    const store = configureStore({ playerGateway, gameGateway, rtcGateway });

    store.dispatch(setPlayer(createPlayer()));

    await store.dispatch(connect());

    expect(store.getState()).toEqual({
      player: expect.objectContaining({
        connected: true,
      }),
    });
  });
});
