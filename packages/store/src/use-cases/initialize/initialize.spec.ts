import { FetchError } from '@cah/client';
import { createGame, createPlayer } from '@cah/shared';

import { playerSelectors } from '../../slices/player/player.selectors';
import { PlayerSlice } from '../../slices/player/player.slice';
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

    expect(store.getPlayer()).toEqual<PlayerSlice>({
      id: 'playerId',
      nick: 'nick',
      selectedChoicesIds: [],
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

  it('does not fail when the player is not authenticated', async () => {
    store.client.getAuthenticatedPlayer.mockRejectedValue(new FetchError(401, ''));

    await store.dispatch(initialize());

    expect(store.select(playerSelectors.hasPlayer)).toBe(false);
  });
});
