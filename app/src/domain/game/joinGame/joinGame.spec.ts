import expect from 'expect';

import { GameState } from '../../../interfaces/entities/Game';
import { AppStore } from '../../../store/types';
import { expectState, inMemoryStore } from '../../../store/utils';
import { InMemoryRouterGateway } from '../../gateways/InMemoryRouterGateway';

import { joinGame } from './joinGame';

describe('joinGame', () => {
  let routerGateway: InMemoryRouterGateway;

  let store: AppStore;

  beforeEach(() => {
    routerGateway = new InMemoryRouterGateway();

    store = inMemoryStore({ routerGateway });
  });

  it('joins a game', async () => {
    await store.dispatch(joinGame('OK42'));

    expectState(store, 'game', {
      id: 'id',
      code: 'OK42',
      state: GameState.idle,
      players: [],
    });
  });

  it('redirects to the game view', async () => {
    await store.dispatch(joinGame('OK42'));

    expect(routerGateway.pathname).toEqual('/game/OK42');
  });
});
