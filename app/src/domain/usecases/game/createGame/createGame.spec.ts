import expect from 'expect';

import { createGame as createGameFactory } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { GameState } from '../../../entities/Game';

import { createGame } from './createGame';

describe('createGame', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('creates a game', async () => {
    const game = (store.gameGateway.game = createGameFactory({ code: 'OK42' }));

    await store.dispatch(createGame());

    store.expectState('game', {
      id: game.id,
      code: 'OK42',
      state: GameState.idle,
      players: [],
      turns: [],
    });
  });

  it('redirects to the game view', async () => {
    await store.dispatch(createGame());

    expect(store.routerGateway.pathname).toEqual('/game/OK42');
  });
});
