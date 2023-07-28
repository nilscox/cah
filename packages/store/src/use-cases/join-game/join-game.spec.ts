import { Game, createGame } from '@cah/shared';

import { TestStore } from '../../test-store';

import { joinGame } from './join-game';

describe('joinGame', () => {
  let store: TestStore;
  let game: Game;

  beforeEach(() => {
    store = new TestStore();
    game = createGame({ id: 'gameId' });

    store.setPlayer();

    store.client.joinGame.mockResolvedValue('gameId');
    store.client.getGame.mockResolvedValue(game);
  });

  it('joins an existing game game', async () => {
    await store.dispatch(joinGame('42SH'));

    expect(store.client.joinGame).toHaveBeenCalledWith('42SH');
    expect(store.getGame()).toHaveProperty('id', 'gameId');
  });

  it("sets the player's gameId", async () => {
    await store.dispatch(joinGame('42SH'));

    expect(store.getPlayer()).toHaveProperty('gameId', 'gameId');
  });
});
