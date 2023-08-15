import { createGame, createCurrentPlayer } from '@cah/shared';

import { PlayerSlice } from '../../slices/player/player.slice';
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

    expect(store.getPlayer()).toEqual<PlayerSlice>({
      id: 'playerId',
      nick: 'perry',
    });
  });

  it("fetches the player's game", async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createCurrentPlayer({ gameId: 'gameId' }));
    store.client.getGame.mockResolvedValue(createGame({ id: 'gameId' }));

    await store.dispatch(authenticate(''));

    expect(store.getGame()).toHaveProperty('id', 'gameId');
  });

  it('connects to the events stream', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue(createCurrentPlayer());

    await store.dispatch(authenticate(''));

    expect(store.client.connect).toHaveBeenCalledWith();
  });
});
