import { FetchError } from '@cah/client/src';
import { Player, createGame, createPlayer } from '@cah/shared';

import { TestStore } from '../../test-store';

import { authenticate } from './authenticate';

describe('authenticate', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  it('authenticates as a new player', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue({
      id: 'playerId',
      nick: 'perry',
    });

    await store.dispatch(authenticate('perry'));

    expect(store.client.authenticate).toHaveBeenCalledWith('perry');

    expect(store.getPlayer()).toEqual<Player>({
      id: 'playerId',
      nick: 'perry',
    });
  });

  it("fetches the player's game", async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createPlayer({ gameId: 'gameId' }));
    store.client.getGame.mockResolvedValue(createGame({ id: 'gameId' }));

    await store.dispatch(authenticate(''));

    expect(store.getGame()).toHaveProperty('id', 'gameId');
  });

  it('connects to the events stream', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createPlayer());

    await store.dispatch(authenticate(''));

    expect(store.client.connect).toHaveBeenCalledWith();
  });

  it('does not fail when the player is not authenticated', async () => {
    store.client.getAuthenticatedPlayer.mockRejectedValue(new FetchError(404, ''));

    await store.dispatch(authenticate('perry'));

    expect(store.getPlayer()).toBeNull();
  });
});
