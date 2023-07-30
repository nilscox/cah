import { gameSelectors } from '../../slices/game/game.selectors';
import { playerSelectors } from '../../slices/player/player.selectors';
import { TestStore } from '../../test-store';

import { clearAuthentication } from './clear-authentication';

describe('clearAuthentication', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
    store.setGame();
  });

  it("clears the player's authentication", async () => {
    await store.dispatch(clearAuthentication());

    expect(store.client.clearAuthentication).toHaveBeenCalledWith();
    expect(store.select(playerSelectors.hasPlayer)).toBe(false);
    expect(store.select(gameSelectors.hasGame)).toBe(false);
  });
});
