import { selectHasGame } from '../../slices/game/game.selectors';
import { selectAllPlayers } from '../../slices/players/players.selectors';
import { TestStore } from '../../test-store';

import { leaveGame } from './leave-game';

describe('leaveGame', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
    store.setGame();
  });

  it('leaves the current game', async () => {
    await store.dispatch(leaveGame());

    expect(store.client.leaveGame).toHaveBeenCalled();
  });

  it('disconnects from the events stream', async () => {
    await store.dispatch(leaveGame());

    expect(store.client.disconnect).toHaveBeenCalled();
  });

  it('removes the current game and players', async () => {
    await store.dispatch(leaveGame());

    expect(store.select(selectHasGame)).toBe(false);
    expect(store.select(selectAllPlayers)).toEqual([]);
  });
});
