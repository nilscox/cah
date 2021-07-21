import expect from 'expect';

import { GameState } from '../../../interfaces/entities/Game';
import { AppStore } from '../../../store/types';
import { expectState, inMemoryStore } from '../../../store/utils';
import { InMemoryRouterGateway } from '../../gateways/InMemoryRouterGateway';

import { createGame } from './createGame';

describe('createGame', () => {
  let routerGateway: InMemoryRouterGateway;

  let store: AppStore;

  beforeEach(() => {
    routerGateway = new InMemoryRouterGateway();

    store = inMemoryStore({ routerGateway });
  });

  it('creates a game', async () => {
    const store = inMemoryStore();

    await store.dispatch(createGame());

    expectState(store, 'game', {
      id: 'id',
      code: 'OK42',
      state: GameState.idle,
      players: [],
    });
  });

  it('redirects to the game view', async () => {
    await store.dispatch(createGame());

    expect(routerGateway.pathname).toEqual('/game/OK42');
  });
});
