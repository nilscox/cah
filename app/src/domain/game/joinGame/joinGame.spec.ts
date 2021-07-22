import expect from 'expect';

import { GameState } from '../../../interfaces/entities/Game';
import { InMemoryStore } from '../../../store/utils';

import { joinGame } from './joinGame';

describe('joinGame', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('joins a game', async () => {
    await store.dispatch(joinGame('OK42'));

    store.expectState('game', {
      id: 'id',
      code: 'OK42',
      state: GameState.idle,
      players: [],
    });
  });

  it('redirects to the game view', async () => {
    await store.dispatch(joinGame('OK42'));

    expect(store.routerGateway.pathname).toEqual('/game/OK42');
  });
});
