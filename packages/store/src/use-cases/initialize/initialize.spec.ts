import { Game, GameState, Player } from '@cah/shared';

import { gameSelectors } from '../../slices/game.slice';
import { playerSelectors } from '../../slices/player.slice';
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

    expect(store.getPlayer()).toEqual<Player>({
      id: 'playerId',
      nick: 'nick',
    });
  });

  it('connects to the events stream', async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue({
      id: 'playerId',
      nick: 'nick',
    });

    await store.dispatch(initialize());

    expect(store.client.connect).toHaveBeenCalled();
  });

  it("fetches the player's game", async () => {
    store.client.getAuthenticatedPlayer.mockResolvedValue({
      id: 'playerId',
      nick: 'nick',
      gameId: 'gameId',
    });

    store.client.getGame.mockResolvedValue({
      id: 'gameId',
      code: 'code',
      state: GameState.idle,
      players: [],
    });

    await store.dispatch(initialize());

    expect(store.getGame()).toEqual<Game>({
      id: 'gameId',
      code: 'code',
      state: GameState.idle,
      players: [],
    });
  });
});
