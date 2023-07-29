import { TestStore } from '../../test-store';

import { startGame } from './start-game';

describe('startGame', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();

    store.setPlayer();
    store.setGame();
  });

  it('starts a game', async () => {
    await store.dispatch(startGame(3));

    expect(store.client.startGame).toHaveBeenCalledWith(3);
  });
});
