import { Player, createGame, createPlayer } from '@cah/shared';

import { TestStore } from '../../test-store';

import { initialize } from './initialize';

describe('initialize', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  it('fetches the authenticated player', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue({ id: 'playerId', nick: 'nick' });

    await store.dispatch(initialize());

    expect(store.getPlayer()).toEqual<Player>({
      id: 'playerId',
      nick: 'nick',
    });
  });

  it('connects to the events stream', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createPlayer());

    await store.dispatch(initialize());

    expect(store.client.connect).toHaveBeenCalled();
  });

  it("fetches the player's game", async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createPlayer({ gameId: 'gameId' }));
    store.client.getGame.mockResolvedValue(createGame({ id: 'gameId' }));

    await store.dispatch(initialize());

    expect(store.getGame()).toHaveProperty('id', 'gameId');
  });
});
