import expect from 'expect';

import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { GameState } from '../../../entities/Game';

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
