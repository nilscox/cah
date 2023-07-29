import { GameState } from '@cah/shared';

import { GameSlice } from '../../slices/game/game.slice';
import { gameSelectors } from '../../slices/game/game.selectors';
import { playerSelectors } from '../../slices/player/player.selectors';
import { TestStore } from '../../test-store';

import { createGame } from './create-game';

describe('createGame', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();

    store.client.createGame.mockResolvedValue('gameId');

    store.client.getGame.mockResolvedValue({
      id: 'gameId',
      code: '42SH',
      state: GameState.idle,
      players: [{ id: 'playerId', nick: '' }],
    });
  });

  it('creates a new game', async () => {
    await store.dispatch(createGame());

    expect(gameSelectors.game(store.getState())).toEqual<GameSlice>({
      id: 'gameId',
      code: '42SH',
      state: GameState.idle,
      players: ['playerId'],
    });
  });

  it("sets the player's gameId", async () => {
    await store.dispatch(createGame());

    expect(playerSelectors.player(store.getState())).toHaveProperty('gameId', 'gameId');
  });
});
