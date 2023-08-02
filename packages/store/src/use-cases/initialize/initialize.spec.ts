import { FetchError } from '@cah/client';
import { createGame, createPlayer } from '@cah/shared';

import { gameSelectors } from '../../slices/game/game.selectors';
import { playerSelectors } from '../../slices/player/player.selectors';
import { TestStore } from '../../test-store';

import { initialize } from './initialize';

describe('initialize', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  it('fetches the authenticated player', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue({
      id: 'playerId',
      nick: 'nick',
    });

    await store.dispatch(initialize());

    expect(store.select(playerSelectors.hasPlayer)).toBe(true);
  });

  it("fetches the player's game", async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createPlayer({ gameId: 'gameId' }));
    store.client.getGame.mockResolvedValue(createGame());

    await store.dispatch(initialize());

    expect(store.select(gameSelectors.hasGame)).toBe(true);
  });

  it('connects to the events stream', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createPlayer());

    await store.dispatch(initialize());

    expect(store.client.connect).toHaveBeenCalled();
  });

  it('does not fail when the player is not authenticated', async () => {
    store.client.getAuthenticatedPlayer.mockRejectedValue(new FetchError(401, ''));

    await store.dispatch(initialize());

    expect(store.select(playerSelectors.hasPlayer)).toBe(false);
  });
});
