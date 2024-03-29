import { FetchError } from '@cah/client';
import { createGame, createCurrentPlayer } from '@cah/shared';

import { selectHasGame } from '../../slices/game/game.selectors';
import { selectHasPlayer } from '../../slices/player/player.selectors';
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

    expect(store.select(selectHasPlayer)).toBe(true);
  });

  it("fetches the player's game", async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createCurrentPlayer({ gameId: 'gameId' }));
    store.client.getGame.mockResolvedValue(createGame());
    store.client.getGameTurns.mockResolvedValue([]);

    await store.dispatch(initialize());

    expect(store.select(selectHasGame)).toBe(true);
  });

  it('connects to the events stream', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createCurrentPlayer());

    await store.dispatch(initialize());

    expect(store.client.connect).toHaveBeenCalled();
  });

  it('does not fail when the player is not authenticated', async () => {
    store.client.getAuthenticatedPlayer.mockRejectedValue(new FetchError(401, ''));

    await store.dispatch(initialize());

    expect(store.select(selectHasPlayer)).toBe(false);
  });
});
