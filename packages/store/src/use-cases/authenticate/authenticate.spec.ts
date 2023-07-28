import { FetchError } from '@cah/client/src';
import { GameState, Player } from '@cah/shared';

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
    store.client.getAuthenticatedPlayer.mockResolvedValue({
      id: 'playerId',
      nick: 'perry',
      gameId: 'gameId',
    });

    store.client.getGame.mockResolvedValue({
      id: 'gameId',
      code: '',
      state: GameState.idle,
      players: [],
    });

    await store.dispatch(authenticate('perry'));

    expect(store.getGame()).toHaveProperty('id', 'gameId');
  });

  it('connects to the events stream', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue({
      id: 'playerId',
      nick: 'perry',
    });

    await store.dispatch(authenticate('perry'));

    expect(store.client.connect).toHaveBeenCalledWith();
  });

  it('does not fail when the player is not authenticated', async () => {
    store.client.getAuthenticatedPlayer.mockRejectedValue(new FetchError(404, ''));

    await store.dispatch(authenticate('perry'));

    expect(store.getPlayer()).toBeNull();
  });
});
