import expect from 'expect';

import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { GameState } from '../../../entities/Game';

import { createGame } from './createGame';

describe('createGame', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('creates a game', async () => {
    await store.dispatch(createGame());

    store.expectState('game', {
      id: 'id',
      code: 'OK42',
      state: GameState.idle,
      players: [],
    });
  });

  it('redirects to the game view', async () => {
    await store.dispatch(createGame());

    expect(store.routerGateway.pathname).toEqual('/game/OK42');
  });
});
