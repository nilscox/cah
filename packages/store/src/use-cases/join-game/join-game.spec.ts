import { Game, createGame } from '@cah/shared';

import { playersSelectors } from '../../slices/players/players.selectors';
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

  it('handles a player-joined event', () => {
    store.setPlayer();
    store.setGame();

    store.dispatchEvent({
      type: 'player-joined',
      playerId: 'playerId',
      nick: 'nick',
    });

    expect(store.select(playersSelectors.all)).toEqual([
      {
        id: 'playerId',
        nick: 'nick',
      },
    ]);

    expect(store.getGame()).toHaveProperty('playersIds', ['playerId']);
  });

  it('handles a player-left event', () => {
    store.setPlayer();
    store.setGame({ playersIds: ['playerId'] });

    store.dispatchEvent({
      type: 'player-left',
      playerId: 'playerId',
    });

    expect(store.select(playersSelectors.all)).toEqual([]);
    expect(store.getGame()).toHaveProperty('playersIds', []);
  });
});
